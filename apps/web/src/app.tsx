import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { InferRequestType } from "hono";
import { Suspense, useEffect } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { api } from "./api";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const useUsers = () =>
  useSuspenseQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.users.$get();
      if (res.ok) {
        return await res.json();
      }

      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Unexpected error");
    },
  });
useUsers.invalidate = () =>
  queryClient.invalidateQueries({ queryKey: ["users"] });

function Test() {
  return <h1 className="mb-4 font-medium text-2xl">Hello world</h1>;
}

function Users() {
  const { data: usersData } = useUsers();
  const { mutate } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (id: string) => {
      await api.users[":id"].$delete({
        param: { id },
      });
    },
    onSettled: () => {
      useUsers.invalidate();
    },
  });

  if (usersData.length === 0) {
    return <p className="text-slate-600 text-sm">No users found</p>;
  }

  return (
    <ul className="menu w-56 rounded-box bg-base-200">
      {usersData.map((user) => (
        <li key={user.id}>
          <div className="flex justify-between">
            <p>{user.name}</p>
            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={() => {
                mutate(user.id.toString());
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

type ReqType = InferRequestType<typeof api.users.$post>["json"];

function CreateUser() {
  const { mutate } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (json: ReqType) => {
      await api.users
        .$post({
          json,
        })
        .then((res) => res.json());

      useUsers.invalidate();
    },
    onSettled: () => {
      useUsers.invalidate();
    },
  });
  async function formAction(formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    mutate({ email, name });
  }

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input input-bordered"
      />
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="input input-bordered"
      />
      <button type="submit" className="btn btn-neutral">
        Send
      </button>
    </form>
  );
}

function Fallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInForceRedirectUrl="/login-success"
    >
      <QueryClientProvider client={queryClient}>
        <COmp />
        <div className="p-4">
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <Test />
          <ErrorBoundary FallbackComponent={Fallback}>
            <Suspense fallback={<p>waiting for message...</p>}>
              <div className="flex flex-col gap-4">
                <Users />
                <CreateUser />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function COmp() {
  const { loaded } = useClerk();

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const { pathname } = window.location;

    if (pathname === "/login-success") {
      queryClient
        .invalidateQueries({
          type: "all",
        })
        .then(() => {
          window.history.pushState({}, "", "/");
        });
    }
  }, [loaded]);

  return null;
}

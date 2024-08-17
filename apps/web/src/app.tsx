import {
  ClerkProvider,
  SignInButton,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { type PropsWithChildren, Suspense, useEffect } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { PUBLISHABLE_KEY, api, clerk } from "./api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const useUsers = () => {
  return useSuspenseQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const client = await api();
      const res = await client.users.$get();

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Unexpected error");
    },
  });
};
useUsers.invalidate = () =>
  queryClient.invalidateQueries({ queryKey: ["users"] });

function ListImages() {
  const { data } = useSuspenseQuery({
    queryKey: ["test"],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      const client = await api();
      const res = await client.storage["list-images"].$get();

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 401) {
        throw new Error("Unauthorized");
      }

      throw new Error("Unexpected");
    },
  });

  return (
    <div>
      <h1 className="mb-4 font-medium text-2xl">Hello world</h1>
      <div>
        {data.map((image) => (
          <div className="avatar" key={image.url}>
            <div className="w-24 rounded">
              {image.contentType?.includes("pdf") ? (
                <iframe src={image.url} title="pdf" />
              ) : (
                <img src={image.url} alt="" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadFile() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    const { name: fileName, type: contentType } = file;

    const client = await api();
    const res = await client.storage["upload-image-url"].$post({
      json: {
        fileName,
        contentType,
      },
    });
    const uploadUrl = await res.json();

    const put = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });

    const ok = put.ok;
    console.log(`Upload status: ${ok ? "success" : "failed"}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start">
      <input type="file" name="file" className="file-input" />
      <button type="submit" className="btn btn-outline btn-success">
        Upload
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

function Loader({ children }: PropsWithChildren) {
  const { loaded } = useClerk();
  const { isSignedIn } = useUser();
  return (
    <div className="">
      {loaded ? (isSignedIn ? children : "not loged in ") : "loading"}
    </div>
  );
}

function Header() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="h-7">
      {isLoaded ? isSignedIn ? <UserButton /> : <SignInButton /> : "Loading"}
    </header>
  );
}

export function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      Clerk={clerk}
      afterSignOutUrl="/"
      signInForceRedirectUrl="/login-success"
    >
      <QueryClientProvider client={queryClient}>
        <RedirectAfterLogin />
        <div className="p-4">
          <Header />
          <Loader>
            <ErrorBoundary FallbackComponent={Fallback}>
              <Suspense fallback={<p>waiting for message...</p>}>
                <ListImages />
                <div className="flex flex-col gap-4">
                  <UploadFile />
                </div>
              </Suspense>
            </ErrorBoundary>
          </Loader>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function RedirectAfterLogin() {
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

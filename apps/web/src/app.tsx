import {
  QueryClient,
  QueryClientProvider,
  type Updater,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { api } from "./api";

const queryClient = new QueryClient();

const useUsers = () =>
  useSuspenseQuery({
    queryKey: ["users"],
    queryFn: () => api.users.$get().then((res) => res.json()),
  });
useUsers.invalidate = () =>
  queryClient.invalidateQueries({ queryKey: ["users"] });
useUsers.cancel = () => queryClient.cancelQueries({ queryKey: ["users"] });
useUsers.getQueryData = () => queryClient.getQueryData(["users"]) as ResType;
useUsers.setQueryData = (
  data: Updater<ResType | undefined, ResType | undefined>,
) => {
  queryClient.setQueryData<ResType>(["users"], data);
};

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
    onMutate: async (id) => {
      await useUsers.cancel();
      const previousUsers = useUsers.getQueryData();
      useUsers.setQueryData((old) =>
        old?.filter((user) => user.id !== Number(id)),
      );

      return { previousUsers };
    },
    onError: (_, __, context) => {
      useUsers.setQueryData(context?.previousUsers);
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
type ResType = InferResponseType<typeof api.users.$get>;

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
    onMutate: async (json) => {
      await useUsers.cancel();
      const previousUsers = useUsers.getQueryData();
      useUsers.setQueryData((old) => [
        ...(old ?? []),
        {
          id: Math.round(Math.random() * 100),
          ...json,
          createdAt: new Date().toISOString(),
          updateAt: null,
        },
      ]);

      return { previousUsers };
    },
    onError: (_, __, context) => {
      useUsers.setQueryData(context?.previousUsers);
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

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4">
        <Test />
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<p>waiting for message...</p>}>
            <div className="flex flex-col gap-4">
              <Users />
              <CreateUser />
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </QueryClientProvider>
  );
}

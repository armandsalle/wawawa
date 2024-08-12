import { api } from "./api";

const users = await api.users.$get().then(async (users) => {
  const data = await users.json();
  return data;
});

export function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <button
            type="button"
            onClick={async () => {
              await api.users[":id"].$delete({
                param: {
                  id: user.id.toString(),
                },
              });
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

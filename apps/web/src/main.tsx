import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { api } from "./api";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const users = await api.users.$get().then(async (users) => {
  const data = await users.json();
  return data;
});

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <h1>Hello, world!</h1>
    {users.map((user) => (
      <div key={user.id}>{user.name}</div>
    ))}
  </React.StrictMode>,
);

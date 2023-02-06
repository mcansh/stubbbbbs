import { useFetcher } from "@remix-run/react";

interface User {
  first_name: string;
  last_name: string;
  username: string;
}

export function Combobox() {
  let fetcher = useFetcher<Array<User>>();

  return (
    <>
      <fetcher.Form action="/users" method="get">
        <input
          type="text"
          name="search"
          onChange={(event) => {
            fetcher.submit(event.target.form);
          }}
          className="rounded border border-gray-400"
        />
      </fetcher.Form>
      <div>
        {fetcher.data && fetcher.data.length ? (
          fetcher.data.map((user) => (
            <div key={user.username}>
              {user.first_name} {user.last_name}
            </div>
          ))
        ) : fetcher.state === "idle" &&
          fetcher.data &&
          fetcher.data.length === 0 ? (
          <div>No users found</div>
        ) : null}
      </div>
    </>
  );
}

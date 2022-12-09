import { useFetcher } from "@remix-run/react";

export function Combobox() {
  let fetcher = useFetcher();
  return (
    <>
      <fetcher.Form action="/users" method="get">
        <input
          type="text"
          name="search"
          onChange={(event) => {
            fetcher.submit(event.target.form);
          }}
        />
      </fetcher.Form>
      <div>
        {fetcher.data?.map((user: any) => (
          <div key={user.username}>
            {user.first_name} {user.last_name}
          </div>
        ))}
      </div>
    </>
  );
}

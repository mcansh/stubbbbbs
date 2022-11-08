import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let username = formData.get("username");

  if (!username) {
    return json({ error: "username is required" }, { status: 400 });
  }

  return json({ message: `username successfully changed to "${username}"` });
}

export function MyComponent({ name }: { name?: string }) {
  let actionData = useActionData<{ error?: string; message?: string }>();

  return (
    <Form
      method="post"
      style={{
        maxWidth: "300px",
        fontFamily:
          "Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
      }}
    >
      <label
        htmlFor="username"
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 500,
          color: "#374151",
        }}
      >
        Username
      </label>
      <input
        type="text"
        name="username"
        id="username"
        style={{
          marginTop: 4,
          display: "block",
          width: "100%",
          borderRadius: 6,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor:
            actionData && "error" in actionData ? "#fca5a5" : "#d1d5db",
          paddingRight: 40,
          color: actionData && "error" in actionData ? "#7f1d1d" : "black",
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
        placeholder="adamwathan"
        aria-invalid={actionData && "error" in actionData ? "true" : undefined}
        aria-describedby="username-error"
        defaultValue={name}
      />

      {actionData && actionData.error ? (
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#dc2626",
          }}
          id="username-error"
        >
          {actionData.error}
        </p>
      ) : null}

      {actionData && actionData.message ? (
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#16a34a",
          }}
        >
          {actionData.message}
        </p>
      ) : null}

      <button type="submit" style={{ marginTop: "8px" }}>
        Submit
      </button>
    </Form>
  );
}

export default function Page() {
  return <MyComponent />;
}

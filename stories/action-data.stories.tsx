import { createRemixStub } from "@remix-run/testing";
import type { StoryFn, Meta } from "@storybook/react";
import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let username = formData.get("username");

  if (!username) {
    return json({ error: "username is required" }, { status: 400 });
  }

  return json({ username });
}

function MyComponent() {
  let actionData = useActionData<typeof action>();

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
      />

      {actionData && "error" in actionData ? (
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

      <button type="submit" style={{ marginTop: "8px" }}>
        Submit
      </button>
    </Form>
  );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof MyComponent> = {
  title: "Example/ActionData",
  component: MyComponent,
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: <Story />,
          action(args) {
            return action({ ...args, context: {} });
          },
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof MyComponent> = () => <MyComponent />;

export const Default = Template.bind({});

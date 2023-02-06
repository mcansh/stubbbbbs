import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { json } from "@remix-run/node";
import type { Meta } from "@storybook/react";
import { Outlet, useActionData } from "@remix-run/react";
import { LoginForm } from "../app/routes/form";

function StorySetup() {
  let actionData = useActionData();

  let emailError =
    actionData && "errors" in actionData && "email" in actionData.errors
      ? actionData.errors.email
      : undefined;
  let passwordError =
    actionData && "errors" in actionData
      ? actionData.errors.password
      : undefined;

  return <LoginForm emailError={emailError} passwordError={passwordError} />;
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof LoginForm> = {
  title: "example/action-data",
  component: StorySetup,
  decorators: [
    (Story) => {
      let RemixStub = createRemixStub([
        {
          element: (
            <div>
              <p>root</p>
              <Outlet />
            </div>
          ),
          children: [
            {
              path: "/login",
              element: <Story />,
              async action({ request }) {
                let formData = await request.formData();
                let email = formData.get("email");
                let password = formData.get("password");
                let errors: { email?: string; password?: string } = {};

                if (typeof email !== "string" || typeof password !== "string") {
                  errors.email = "Email is required";
                  errors.password = "Password is required";
                  return json({ errors }, { status: 400 });
                }

                if (!email.length) {
                  errors.email = "Email is required";
                }

                if (password.length < 8) {
                  errors.password = "Password must be at least 8 characters";
                }

                if (Object.keys(errors).length > 0) {
                  return json({ message: undefined, errors }, { status: 400 });
                }

                return json({
                  message: "Successfully signed up",
                  errors: undefined,
                });
              },
            },
          ],
        },
      ]);

      return <RemixStub initialEntries={["/login"]} />;
    },
  ],
};

export default story;

export const Default = () => <StorySetup />;

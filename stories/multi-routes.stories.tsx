import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import type { Meta } from "@storybook/react";
import { Link, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import LoginPage from "../app/routes/form";

function Home() {
  return (
    <div>
      <h1 className="text-xl text-green-500">Home</h1>
      <Link to="/login" className="italic">
        👉 Login
      </Link>
    </div>
  );
}

function Root() {
  return (
    <div>
      <div className="text-3xl font-medium text-blue-500">root</div>
      <Outlet />
    </div>
  );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof Home> = {
  title: "example/multi-routes",
  component: Home,
  decorators: [
    (Story) => {
      let RemixStub = createRemixStub([
        {
          element: <Root />,
          children: [
            {
              path: "/",
              element: <Story />,
            },
            {
              path: "/login",
              element: (
                <>
                  <Link to="/" className="italic">
                    👈 Home
                  </Link>
                  <LoginPage />
                </>
              ),
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

      return <RemixStub />;
    },
  ],
};

export default story;

export const Default = () => <Home />;

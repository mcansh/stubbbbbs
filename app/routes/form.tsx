import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json(
      {
        message: undefined,
        errors: {
          email: "Email is required",
          password: "Password is required",
        },
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        message: undefined,
        errors: {
          email: undefined,
          password: "Password must be at least 8 characters",
        },
      },
      { status: 400 }
    );
  }

  return json({
    message: "Successfully signed up",
    errors: undefined,
  });
}

export default function LoginPage() {
  let actionData = useActionData<typeof action>();

  let emailError =
    actionData && "errors" in actionData && "email" in actionData.errors
      ? actionData.errors.email
      : undefined;
  let passwordError =
    actionData && "errors" in actionData && "password" in actionData.errors
      ? actionData.errors.password
      : undefined;

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <LoginForm emailError={emailError} passwordError={passwordError} />
      </div>
    </div>
  );
}

export function LoginForm({
  emailError,
  passwordError,
}: {
  emailError?: string;
  passwordError?: string;
}) {
  return (
    <Form method="post" className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "email-error" : undefined}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
          {emailError && (
            <div className="pt-1 text-red-700" id="email-error">
              {emailError}
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? "password-error" : undefined}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
          {passwordError && (
            <div className="pt-1 text-red-700" id="password-error">
              {passwordError}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Log in
      </button>
    </Form>
  );
}

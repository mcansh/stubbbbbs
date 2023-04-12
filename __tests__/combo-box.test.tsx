import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import { Combobox } from "~/components/combo-box";

describe("Combobox", () => {
  test("should render results", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        element: <Combobox />,
      },
      {
        path: "/users",
        loader() {
          return [
            {
              first_name: "Ryan",
              last_name: "Florence",
              username: "ryanflorence",
            },
          ];
        },
      },
    ]);

    render(<RemixStub />);
    let input = screen.getByRole("textbox");
    userEvent.type(input, "Ryan", { delay: 1 });
    await screen.findByText(/ryan/i);
    expect(screen.getByText(/ryan/i)).toBeInTheDocument();
  });

  test("no results", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        element: <Combobox />,
      },
      {
        path: "/users",
        loader() {
          return [];
        },
      },
    ]);

    render(<RemixStub />);
    let input = screen.getByRole("textbox");
    userEvent.type(input, "Ryan", { delay: 1 });
    await screen.findByText(/no users found/i);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });
});

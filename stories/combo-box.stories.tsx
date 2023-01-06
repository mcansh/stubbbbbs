import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Combobox } from "../app/components/combo-box";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof Combobox> = {
  title: "Example/Combobox",
  component: Combobox,
  decorators: [
    (Story, { args, parameters }) => {
      let remix = parameters.remix(args);
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: <Story />,
        },
        {
          path: "/users",
          loader: remix.loader,
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default story;

const Template: StoryFn<typeof Combobox> = (_args) => <Combobox />;

export const ComboboxStory = Template.bind({});
ComboboxStory.parameters = {
  remix(_args: any) {
    return {
      loader() {
        return [
          {
            first_name: "Ryan",
            last_name: "Florence",
            username: "ryanflorence",
          },
        ];
      },
    };
  },
};

ComboboxStory.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  let input = canvas.getByRole("textbox");
  userEvent.type(input, "Ryan", { delay: 1 });
  await canvas.findByText(/ryan/i);
  expect(canvas.getByText(/ryan/i)).toBeInTheDocument();
};

export const NoResultsComboboxStory = Template.bind({});
NoResultsComboboxStory.parameters = {
  remix(_args: any) {
    return {
      loader() {
        return [];
      },
    };
  },
};

NoResultsComboboxStory.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  let input = canvas.getByRole("textbox");
  userEvent.type(input, "Ryan", { delay: 1 });
  await canvas.findByText(/no users found/i);
  expect(canvas.getByText(/no users found/i)).toBeInTheDocument();
};

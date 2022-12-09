import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
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
        // @ts-expect-error
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
  remix(args: any) {
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

export const NoResultsComboboxStory = Template.bind({});
NoResultsComboboxStory.parameters = {
  remix(args: any) {
    return {
      loader() {
        return [];
      },
    };
  },
};

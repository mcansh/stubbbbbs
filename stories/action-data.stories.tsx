import { createRemixStub } from "@remix-run/testing";
import type { StoryFn, Meta } from "@storybook/react";
import { action, MyComponent } from "~/routes/form";

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
          async action(args) {
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
const Template: StoryFn<typeof MyComponent> = (args) => (
  <MyComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  name: "",
};

import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { Combobox } from "../app/components/combo-box";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof Combobox> = {
  title: "Example/Combobox",
  component: Combobox,
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/",
          element: <Story />,
        },
        // @ts-expect-error
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

      return <RemixStub />;
    },
  ],
};

export default story;

export const ComboboxStory: StoryFn<typeof Combobox> = (_args) => <Combobox />;

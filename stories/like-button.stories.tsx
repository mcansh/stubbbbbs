import type { StoryFn, Meta } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useArgs } from "@storybook/client-api";
import { createRemixStub } from "@remix-run/testing";
import { LikeButton } from "../app/routes/post.$postId";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof LikeButton> = {
  title: "Example/LikeButton",
  component: LikeButton,
  decorators: [
    (Story) => {
      const [args, updateArgs] = useArgs();
      const RemixStub = createRemixStub([
        {
          path: "/post/:postId",
          element: <Story />,
          loader: () => {
            return args;
          },
          action: async ({ request, params }) => {
            let formData = await request.formData();
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (params.postId === "2") {
              return new Response(
                JSON.stringify({ error: "something went wrong" }),
                { headers: { "Content-Type": "application/json" } }
              );
            }

            updateArgs({ liked: formData.get("liked") === "true" });
            return null;
          },
        },
      ]);

      return (
        <RemixStub
          initialLoaderData={{ "/post/1": args }}
          initialEntries={["/post/1"]}
        />
      );
    },
  ],
};

export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof LikeButton> = (args) => <LikeButton {...args} />;

export const HappyPath = Template.bind({});
HappyPath.args = {
  action: "/post/1",
  label: "Fake Post",
  liked: false,
};

export const Error = Template.bind({});
Error.args = {
  action: "/post/2",
  label: "Fake Post",
  liked: false,
};

Error.play = async ({ canvasElement }) => {
  let canvas = within(canvasElement);
  userEvent.click(canvas.getByRole("button"));
};

import type { StoryFn, Meta } from "@storybook/react";
import { useArgs } from "@storybook/client-api";
import { createRemixStub } from "@remix-run/testing";
import { useFetcher } from "@remix-run/react";

interface LikeButtonProps {
  label: string;
  liked: boolean;
  action: string;
}

function LikeButton({ liked, label, action }: LikeButtonProps) {
  let fetcher = useFetcher();
  let isLiked = fetcher.submission
    ? fetcher.submission.formData?.get("liked") === "true"
    : liked;

  return (
    <fetcher.Form method="post" action={action}>
      {/* jsdom doesn't support passing the value of the form submit button since
          it filters out all buttons from form data in the following code.
          https://github.com/jsdom/jsdom/blob/e285763ebf46bbc9c883a519c9a18231f5ede9d8/lib/jsdom/living/xhr/FormData-impl.js#L109 */}
      <input type="hidden" name="liked" value={String(!isLiked)} />

      <button
        aria-label={label}
        name="liked"
        value={String(!isLiked)}
        type="submit"
      >
        {isLiked ? "♥" : "♡"}
      </button>
    </fetcher.Form>
  );
}

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
          action: async ({ request }) => {
            let formData = await request.formData();
            await new Promise((resolve) => setTimeout(resolve, 1000));
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

export const Liked = Template.bind({});
Liked.args = {
  action: "/post/1",
  label: "Fake Post",
  liked: true,
};

export const NotLiked = Template.bind({});
NotLiked.args = {
  action: "/post/1",
  label: "Fake Post",
  liked: false,
};

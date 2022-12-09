import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { LikeButton } from "../app/routes/post.$postId";
import { json } from "../app/json";
import type { DataFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

function StoryPost() {
  let data = useLoaderData();
  console.log("data", data);
  return <LikeButton {...data} />;
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof LikeButton> = {
  title: "Example/LikeButton",
  component: StoryPost,
  argTypes: {
    action: { table: { disable: true } },
    label: { table: { disable: true } },
    liked: { table: { disable: true } },
  },
  decorators: [
    (Story, { parameters, args }) => {
      let remix = parameters.remix(args);
      const RemixStub = createRemixStub([
        {
          path: "/post/:postId",
          element: <Story />,
          action: remix.action,
          loader: remix.loader,
        },
      ]);

      return (
        <RemixStub
          initialLoaderData={{ [args.action]: args }}
          initialEntries={[args.action]}
        />
      );
    },
  ],
};

export default story;

export const MockedSuccess: StoryFn = (_args) => <StoryPost />;

MockedSuccess.args = {
  action: "/post/1",
  label: "Fake Post",
  liked: false,
};

MockedSuccess.parameters = {
  remix(args: any) {
    let scopedJunk = args;

    return {
      loader: async () => {
        return json(scopedJunk);
      },
      async action({ request }: DataFunctionArgs) {
        let formData = await request.formData();
        await new Promise((resolve) => setTimeout(resolve, 2_000));
        scopedJunk.liked = formData.get("liked") === "true";
        return null;
      },
    };
  },
};

export const MockedError: StoryFn = (_args) => <StoryPost />;

MockedError.args = {
  action: "/post/2",
  label: "Fake Post 2",
  liked: false,
};

MockedError.parameters = {
  remix(args: any) {
    let scopedJunk = args;

    return {
      loader: async () => {
        return json(scopedJunk);
      },
      async action() {
        await new Promise((resolve) => setTimeout(resolve, 2_000));
        return json({ error: "something went wrong" }, { status: 422 });
      },
    };
  },
};

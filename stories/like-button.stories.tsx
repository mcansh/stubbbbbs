import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { LikeButton } from "../app/routes/post.$postId";
import { json } from "../app/json";
import type { DataFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

function StoryPost() {
  let data = useLoaderData();
  return <LikeButton {...data} />;
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof LikeButton> = {
  title: "Example/LikeButton",
  component: StoryPost,
  // hide the args table for the component
  // as we're only using them for initial values
  // and updating everything through remix
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
          hydrationData={{ loaderData: { [args.action]: args } }}
          initialEntries={[args.action]}
        />
      );
    },
  ],
};

export default story;

const Template: StoryFn = (_args) => <StoryPost />;

export const MockedSuccess = Template.bind({});

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

export const MockedError = Template.bind({});

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

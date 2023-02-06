import { expect } from "@storybook/jest";
import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { json } from "@remix-run/node";
import { LikeButton, text } from "../app/routes/post.$postId";
import type { DataFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";

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
          hydrationData={{ loaderData: { "0": args } }}
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

MockedSuccess.play = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);

  // check for defaults
  await expect(canvas.getByText(text.unliked)).toBeInTheDocument();
  await expect(args.liked).toBe(false);

  await userEvent.click(canvas.getByRole("button"));

  // check optimistic render, we haven't resolved the action or loader yet
  await waitFor(() => canvas.getByText(text.liked));

  // assert it's optimistic, our action will not have changed this yet
  await expect(args.liked).toBe(false);

  // wait for the action
  await waitFor(() => args.liked === true);

  // expect to still see the heart
  await expect(canvas.getByText(text.liked)).toBeDefined();
};

export const MockedSuccessPreLiked = Template.bind({});

MockedSuccessPreLiked.args = {
  action: "/post/2",
  label: "Fake Post 2",
  liked: true,
};

MockedSuccessPreLiked.parameters = {
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

MockedSuccessPreLiked.play = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  // check for defaults
  await expect(canvas.getByText(text.liked)).toBeInTheDocument();
  await expect(args.liked).toBe(true);

  await userEvent.click(canvas.getByRole("button"));

  // check optimistic render, we haven't resolved the action or loader yet
  await waitFor(() => canvas.getByText(text.unliked));

  // assert it's optimistic, our action will not have changed this yet
  await expect(args.liked).toBe(true);

  // wait for the action
  await waitFor(() => args.liked === true);

  // expect to still see the white heart
  await expect(canvas.getByText(text.unliked)).toBeDefined();
};

export const MockedError = Template.bind({});

MockedError.args = {
  action: "/post/3",
  label: "Fake Post 3",
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

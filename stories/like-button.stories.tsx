import type { StoryFn, Meta } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import type { LikeButtonProps } from "../app/routes/post.$postId";
import { LikeButton } from "../app/routes/post.$postId";
import { json } from "../app/json";
import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface SetupResult {
  loader: () =>
    | Promise<TypedResponse<LikeButtonProps>>
    | TypedResponse<LikeButtonProps>
    | LikeButtonProps;
  action: (args: DataFunctionArgs) => Promise<Response | null>;
}

function StoryPost() {
  let data = useLoaderData();

  return <LikeButton {...data} />;
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof LikeButton> = {
  title: "Example/LikeButton",
  component: LikeButton,
  args: {},
  parameters: {
    remix(setup: any): SetupResult {
      let scopedJunk: LikeButtonProps = {
        action: "/post/1",
        label: "Fake Post",
        liked: false,
      };

      return {
        loader: async () => {
          console.log("loader", scopedJunk);
          return json(scopedJunk);
        },
        async action({ request, params }: DataFunctionArgs) {
          console.log("action", params);
          let formData = await request.formData();
          await new Promise((resolve) => setTimeout(resolve, 2_000));

          if (params.postId === "2") {
            return json({ error: "something went wrong" }, { status: 500 });
          }

          scopedJunk.liked = formData.get("liked") === "true";
          return null;
        },
      };
    },
  },
  decorators: [
    (Story, init) => {
      console.log(init);

      let remix = init.parameters.remix();

      console.log(remix);

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
          initialLoaderData={{ "/post/1": remix.loader }}
          initialEntries={["/post/1"]}
        />
      );
    },
  ],
};

export default story;

export const Default: StoryFn = (_args) => <StoryPost />;

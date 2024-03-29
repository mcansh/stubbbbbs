import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";

export interface LikeButtonProps {
  label: string;
  liked: boolean;
  action: string;
}

export let text = {
  liked: "❤️",
  unliked: "🤍",
} as const;

export function LikeButton({ liked, label, action }: LikeButtonProps) {
  let fetcher = useFetcher();

  let isLiked = fetcher.formData
    ? fetcher.formData.get("liked") === "true"
    : liked;

  return (
    <fetcher.Form method="post" action={action}>
      {/*
        jsdom doesn't support passing the value of the form submit button since
        it filters out all buttons from form data in the following code.
        https://github.com/jsdom/jsdom/blob/e285763ebf46bbc9c883a519c9a18231f5ede9d8/lib/jsdom/living/xhr/FormData-impl.js#L109
      */}
      <input type="hidden" name="liked" value={String(!isLiked)} />

      <button
        aria-label={label}
        name="liked"
        value={String(!isLiked)}
        type="submit"
      >
        {isLiked ? text.liked : text.unliked}
      </button>

      {fetcher.data?.error ? (
        <div style={{ color: "red" }}>{fetcher.data.error}</div>
      ) : null}
    </fetcher.Form>
  );
}

let fakePost = {
  action: "/post/1",
  label: "Fake Post",
  liked: false,
};

export async function action({ request, params }: ActionArgs) {
  let formData = await request.formData();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (params.postId === "2") {
    return json({ error: "something went wrong" }, { status: 422 });
  }

  fakePost.liked = formData.get("liked") === "true";

  return null;
}

export async function loader(args: LoaderArgs) {
  return fakePost;
}

export default function Screen() {
  return (
    <div>
      <LikeButton label="Post 1" liked={false} action="/post/1" />
    </div>
  );
}

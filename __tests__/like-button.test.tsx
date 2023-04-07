import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { useLoaderData } from "@remix-run/react";
import { unstable_createRemixStub } from "@remix-run/testing";

import { LikeButton, text } from "../app/routes/post.$postId";

describe("LikeButton", () => {
  let fakePost = {
    action: "/post/123",
    label: "Fake Post",
    liked: false,
  };

  afterEach(() => {
    fakePost.liked = false;
  });

  let RemixStub = unstable_createRemixStub([
    {
      path: "post/:postId",
      loader: () => fakePost,
      element: <TestSubject />,
      action: async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        let formData = await request.formData();
        fakePost.liked = JSON.parse(formData.get("liked") as string);
        return null;
      },
    },
  ]);

  function TestSubject() {
    let post = useLoaderData();

    return (
      <LikeButton action={post.action} label={post.label} liked={post.liked} />
    );
  }

  it("renders an empty heart initially", async () => {
    render(
      <RemixStub
        initialEntries={["/post/123"]}
        hydrationData={{ loaderData: { "0": fakePost } }}
      />
    );

    await waitFor(() => screen.getByRole("button"));
    expect(screen.getByRole("button").innerHTML).toMatch(text.unliked);
  });

  // In this test we no longer need to mock useFetcher return values, the test
  // also no longer has to know the implementation details of the spelling of
  // "liked" in the formData
  it("optimistically renders the heart", async () => {
    render(
      <RemixStub
        initialEntries={["/post/123"]}
        hydrationData={{ loaderData: { "0": fakePost } }}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    // check optimistic render, we haven't resolved the action or loader yet
    await waitFor(() => screen.getByText(text.liked));

    // assert it's optimistic, our action will not have changed this yet
    expect(fakePost.liked).toBe(false);

    // wait for the action
    await waitFor(() => fakePost.liked === true);

    // expect to still see the heart
    expect(screen.getByText(text.liked)).toBeDefined();
  });
});

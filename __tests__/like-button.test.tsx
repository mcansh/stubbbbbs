import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { useLoaderData } from "@remix-run/react";
import { unstable_createRemixStub } from "@remix-run/testing";

import { LikeButton } from "../app/routes/post.$postId";

describe("LikeButton", () => {
  let fakePost = {
    action: "/post/123",
    label: "Fake Post",
    liked: false,
  };

  let RemixStub = unstable_createRemixStub([
    {
      path: "/post/:postId",
      loader: () => fakePost,
      element: <TestSubject />,
      action: async ({ request }) => {
        let formData = await request.formData();
        fakePost.liked = JSON.parse(formData.get("liked") as string);
        return null;
      },
    },
  ]);

  function TestSubject() {
    let data = useLoaderData();
    return <LikeButton {...data} />;
  }

  afterEach(() => {
    fakePost.liked = false;
  });

  it("renders an empty heart initially", async () => {
    render(
      <RemixStub
        hydrationData={{
          loaderData: {
            "/post/:postId": fakePost,
          },
        }}
        initialEntries={["/post/123"]}
      />
    );
    await waitFor(() => screen.getByRole("button"));

    expect(screen.getByRole("button").innerHTML).toMatch("🤍");
  });

  it("optimistically renders the heart", async () => {
    render(
      <RemixStub
        initialEntries={["/post/123"]}
        hydrationData={{
          loaderData: { "/post/:postId": fakePost },
        }}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => screen.getByText("❤️"));

    expect(fakePost.liked).toBe(false);

    await waitFor(() => fakePost.liked === true);

    expect(screen.getByText("❤️")).toBeDefined();
  });
});

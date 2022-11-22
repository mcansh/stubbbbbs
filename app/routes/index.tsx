import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="form">Form</Link>
        </li>
        <li>
          <Link to="post/1">Like Button</Link>
        </li>
      </ul>
    </div>
  );
}

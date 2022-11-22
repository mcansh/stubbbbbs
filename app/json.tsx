/**
 * getting a `The requested module '@remix-run/node/dist/index.js' does not provide an export named 'json'` error from storybook if i use json from `@remix-run/node`
 * might be yalc related :shrug:
 */

import type { JsonFunction } from "@remix-run/node";

export const json: JsonFunction = (data, init = {}) => {
  let responseInit = typeof init === "number" ? { status: init } : init;
  let headers = new Headers(responseInit.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  return new Response(JSON.stringify(data), { headers });
};

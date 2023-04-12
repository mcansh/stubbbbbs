import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm",
    {
      name: "@storybook/addon-styling",
      options: { postCss: true },
    },
  ],
  core: {},
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    config.plugins ||= [];
    config.plugins.push(tsconfigPaths());

    return config;
  },
} satisfies StorybookConfig;

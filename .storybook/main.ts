import type { StorybookConfig } from "@storybook/builder-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
  },
  framework: "@storybook/react-vite",
};

export default config;

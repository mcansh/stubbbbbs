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
  async viteFinal(config, options) {
    // Due to the deep imports vite will double import/bundle the RemixEntry component without this.
    config.resolve = {
      alias: {
        // prettier-ignore
        "@remix-run/react/dist/components": "@remix-run/react/dist/esm/components",
      },
    };
    return config;
  },
  framework: "@storybook/react-vite",
};

export default config;

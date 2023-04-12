import type { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
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
} satisfies StorybookConfig

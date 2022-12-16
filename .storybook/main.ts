import type { StorybookConfig } from "@storybook/builder-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  features: {
    interactionsDebugger: true, // 👈 Enable playback controls
  },
  core: { builder: "@storybook/builder-vite" },
  framework: "@storybook/react-vite",
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        global: "window",
        process: {
          env: {},
        },
      },
    });
  },
};

export default config;

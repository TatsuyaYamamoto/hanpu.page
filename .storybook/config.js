import { configure } from "@storybook/react";

// automatically import all files ending in *.stories.js
configure(require.context("../app/components", true, /\.stories\.tsx?$/), module);

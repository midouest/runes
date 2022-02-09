import * as path from "path";

import { Configuration } from "webpack";

import rules from "./webpack.rules";

const config: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      main: path.resolve(__dirname, "src/backend"),
      bridge: path.resolve(__dirname, "src/bridge"),
    },
  },
};

export = config;

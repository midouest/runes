import * as path from "path";

import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";
import { Configuration } from "webpack";

import basePlugins from "./webpack.plugins";
import baseRules from "./webpack.rules";

const rules = [
  ...baseRules,
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
  {
    test: /\.ttf$/,
    type: "asset/resource",
  },
  {
    test: /\.wasm$/,
    type: "asset/resource",
  },
  {
    test: /\.data$/,
    type: "asset/resource",
  },
];

const plugins = [
  ...basePlugins,
  new MonacoEditorWebpackPlugin({ languages: ["lua"] }),
];

const config: Configuration = {
  output: {
    chunkFilename: "main_window/[name].js",
    publicPath: "../",
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".wasm", ".data"],
    fallback: {
      fs: false,
      path: false,
      crypto: false,
      child_process: false,
    },
    alias: {
      bridge: path.resolve(__dirname, "src/bridge"),
      render: path.resolve(__dirname, "src/frontend"),
      "matron-wasm": path.resolve(__dirname, "matron/build/matron"),
    },
  },
};

export = config;

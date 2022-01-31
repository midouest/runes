const baseRules = require("./webpack.rules");
const basePlugins = require("./webpack.plugins");
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
];

const plugins = [
  ...basePlugins,
  new MonacoEditorWebpackPlugin({ languages: ["lua"] }),
  new CopyPlugin({
    patterns: [
      { from: "./matron/build/matron.wasm", to: "matron.worker/matron.wasm" },
      { from: "./matron/build/matron.data", to: "matron.worker/matron.data" },
    ],
  }),
];

module.exports = {
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
  },
};

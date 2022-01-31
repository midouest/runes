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
  // HACK: Having difficulty configuring webpack to detect these files so just
  // copy them directly to the output. The .wasm file can be detected with a
  // loader, but the .data file is fetched via XHR. This plugin gets executed
  // for renderer AND preload, so we end up with duplicates of both of these
  // files.
  new CopyPlugin({
    patterns: [
      {
        from: "./matron/build/matron.wasm",
        to: "matron.wasm",
      },
      {
        from: "./matron/build/matron.data",
        to: "matron.data",
      },
    ],
  }),
];

module.exports = {
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
  },
};

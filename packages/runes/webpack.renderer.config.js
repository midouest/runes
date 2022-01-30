const baseRules = require("./webpack.rules");
const basePlugins = require("./webpack.plugins");
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");

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
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      fs: false,
      path: false,
    },
  },
};

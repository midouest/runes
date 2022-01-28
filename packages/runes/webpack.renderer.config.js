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
    use: [{ loader: "file-loader" }],
  },
];

const plugins = [
  ...basePlugins,
  new MonacoEditorWebpackPlugin({ languages: ["lua"] }),
];

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};

const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new MonacoEditorWebpackPlugin({ languages: ["lua"] })
      );

      webpackConfig.module.rules.push({
        test: /\.ttf$/,
        type: "asset/resource",
      });

      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: "asset/resource",
      });

      webpackConfig.module.rules.push({
        test: /\.data$/,
        type: "asset/resource",
      });

      webpackConfig.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        child_process: false,
      };

      return webpackConfig;
    },
  },
};

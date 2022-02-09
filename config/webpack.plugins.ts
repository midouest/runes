import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { WebpackPluginInstance } from "webpack";

const plugins: WebpackPluginInstance[] = [new ForkTsCheckerWebpackPlugin()];

export default plugins;

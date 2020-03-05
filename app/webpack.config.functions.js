const path = require("path");
const nodeExternals = require("webpack-node-externals");

const plugins = [];
const externals = [nodeExternals()];
const production = process.env.NODE_ENV === "production";

module.exports = {
  target: "node",

  mode: production ? "production" : "development",

  entry: "./app/index.functions.ts",

  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../dist/functions"),
    libraryTarget: "this"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { compilerOptions: { noEmit: false } }
      }
    ]
  },

  externals,

  plugins
};

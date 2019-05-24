const nodeExternals = require("webpack-node-externals");

const plugins = [];
const externals = [nodeExternals()];

module.exports = {
  target: "node",

  mode: "development",

  entry: "./app/index.functions.ts",

  output: {
    filename: "index.js",
    path: __dirname + "/dist/functions",
    libraryTarget: "this"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },

  externals,

  plugins
};

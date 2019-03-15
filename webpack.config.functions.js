const path = require("path");

const nodeExternals = require("webpack-node-externals");

const plugins = [];

module.exports = {
  mode: "development",

  entry: "./src/index.functions.ts",

  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "functions")
  },

  devtool: "source-map",

  target: "node",

  externals: [nodeExternals()],

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },

  plugins
};

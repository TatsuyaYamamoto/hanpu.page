const HtmllWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmllWebpackPlugin({
    template: "./app/index.ejs"
  })
];

module.exports = {
  entry: "./app/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },

  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },

  plugins
};

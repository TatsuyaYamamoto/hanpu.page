const HtmllWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmllWebpackPlugin({
    template: "./app/index.ejs"
  })
];

module.exports = {
  target: "web",

  mode: "development",

  entry: "./app/index.client.tsx",

  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/public"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },

  devServer: {
    historyApiFallback: true
  },

  plugins
};

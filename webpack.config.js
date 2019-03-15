const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "src/index.ejs"
  })
];

module.exports = {
  mode: "development",

  entry: "./src/index.tsx",

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public")
  },

  devtool: "source-map",

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

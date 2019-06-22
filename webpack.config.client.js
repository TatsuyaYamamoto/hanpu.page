const HtmllWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  noIndex: true,
  gaTrackingId: "UA-127664761-5",
  title: "DEVELOPMENT DLCode",
  keyword: "DLCode,ダウンロードコード",
  description:
    "DLCodeはファイルの配布、ダウンロード用のコードの発行が行えるアプリです。ダウンロードコードをお持ちの方のみ、ファイルをダウンロードすることが出来ます。"
};

if (isProduction) {
  Object.assign(htmlParams, {
    noIndex: false,
    title: "DLCode"
  });
}

const plugins = [
  new HtmllWebpackPlugin({
    template: "./app/index.ejs",
    templateParameters: htmlParams,
    hash: true
  })
];

module.exports = {
  target: "web",

  mode: isProduction ? "production" : "development",

  entry: "./app/index.client.tsx",

  output: {
    filename: "bundle.js",
    publicPath: "/",
    path: __dirname + "/dist/public"
  },

  devtool: isProduction ? "none" : "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },

  devServer: {
    historyApiFallback: true
  },

  plugins
};


const isProduction = process.env.NODE_ENV === "production";

const env = {
  noIndex: true,
  gaTrackingId: "UA-127664761-5",
  title: "DEVELOPMENT DLCode",
  keyword: "DLCode,ダウンロードコード",
  description:
    "DLCodeはファイルの配布、ダウンロード用のコードの発行が行えるアプリです。ダウンロードコードをお持ちの方のみ、ファイルをダウンロードすることが出来ます。"
};

if (isProduction) {
  Object.assign(env, {
    noIndex: false,
    title: "DLCode"
  });
}

module.exports = {
  env
};

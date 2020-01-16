# DLCode.web.app

[![CircleCI](https://circleci.com/gh/TatsuyaYamamoto/dl-code.web.app/tree/develop.svg?style=svg)](https://circleci.com/gh/TatsuyaYamamoto/dl-code.web.app/tree/develop)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

hosted in [https://dl-code.web.app/]()

## なにこれ

1. つくるひと
   1. 曲とか絵とかのファイルを作って
   1. `ProductFile`としてアプリに登録して
   1. `DownloadCode`を発行して
   1. `DownloadCode`を何かしらの手段で **たのしむひと** にお渡しして
   1. _たのしむひと_ に`ProductFile`をダウンロードしてもらう
1. たのしむひと
   1. 何かしらの手段で **つくるひと** から`DownloadCode`を手に入れて
   1. [https://dl-code.web.app/]() にアクセスして
   1. DownloadCode を入力して
   1. `ProductFile`をダウンロードして
   1. 楽しい！！

## Dev and Deploy

```bash
$ yarn start

// some commits...

$ yarn build-dev
$ yarn deploy-dev
// or
$ git push origin develop # deploy by CircleCI

```

- note - firebase app 用ビルドスクリプトの手順は以下の通り(並列に行っている) 1. [client] next build して、成果物を dist/functions に copy 1. [functions] webpack build 1. [deps] package.json yarn.lock(functions にとっての依存ライブラリ)を dist/functions に copy して、yarn install - app/.next にビルドしたものを dist 以下に copy しているのは、node_modules と同階層に next.js の distDir を設定すると、React が Error(Invalid hook call. Hooks can only be called inside of the body of a function component.)を投げる、また`next build`が失敗するから

## Settings

### Service Account

```bash
$ PROJECT_ID=hoge
$ SERVICE_ACCOUNT=hoge
$ BUCKET_NAME=hoge

$ gcloud projects add-iam-policy-binding ${PROJECT_ID} \
      --member serviceAccount:${SERVICE_ACCOUNT} \
      --role roles/datastore.importExportAdmin

$ gsutil iam ch serviceAccount:${SERVICE_ACCOUNT}:storage.admin \
      gs://${BUCKET_NAME}

$ firebase functions:config:set service_account="$(cat path/to/service_account.json)"
```

Ref. [https://github.com/firebase/firebase-tools/issues/406]()
Ref. [https://firebase.google.com/docs/firestore/solutions/schedule-export#configure_access_permissions]()

### storage cors

```bash
$ gsutil cors set firebase/cors.json gs://dl-code-dev.appspot.com
```

Ref: [https://firebase.google.com/docs/storage/web/download-files#cors_configuration]()

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

$ yarn build:dev
$ yarn deploy:dev
// or
$ git push origin develop # deploy by CircleCI

```

## Settings

### storage cors

```bash
$ gsutil cors set firebase/cors.json gs://dl-code-dev.appspot.com
```

Ref: [https://firebase.google.com/docs/storage/web/download-files#cors_configuration]()

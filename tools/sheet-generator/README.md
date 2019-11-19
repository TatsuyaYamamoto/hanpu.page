# DLCode Sheet Generator

DLCode Sheetを印刷するためのテンプレート(pptx file)と、Sheetを生成するためのスクリプト


## DLCode Sheet?

- DLCodeの利用者(ダウンロードする人)は、DLCodeへのアクセス + ダウンロードコードの入力 を行うことで対象のダウンロードページにアクセスする。
- DLCode Sheetは、アクセス先のURL、一意のダウンロードコード、およびそれらをデコードしたQRコードを印字したもの。
- 任意のパッケージに貼り付けて使用する想定

## Design

- card
    - w: 6.9 (~ 27.53 / 4 )
    - h: 3.81 (~ 19.05 / 5 )

## Flow


1. download dl-code csv file.
1. shell

	```
	$ ./tools/sheet-generator/createPptx.sh hoge.csv
	```
1. open file as pptx
1. print	

#!/bin/bash

OUTPUT_DIR=`pwd`
DOWNLOAD_CODE_LIST_CSV=$1
BASE_PPTX_SRC_DIR=$2

NOW=`date "+%Y%m%d_%H%M%S"`
WORKDIR="/tmp/dl-code-pptx_${NOW}/"
GENERATE_FILE_PATH=${OUTPUT_DIR}/dl-code_${NOW}.pptx
DLCODE_URL="https://dl-code.web.app"
MAX_CODE_COUNT=12 # 個/ページ

mkdir ${WORKDIR}
echo "create working directory. path: ${WORKDIR}"

cp -r ${BASE_PPTX_SRC_DIR}* ${WORKDIR}
echo "copy s."
ls -l ${WORKDIR}

DOWNLOAD_CODE_LIST=()

# TODO validate provided csv file

while read code; do
    if [[ -z ${code} ]]; then
        continue
    fi

    DOWNLOAD_CODE_LIST+=(${code})
done < ${DOWNLOAD_CODE_LIST_CSV}

echo code size: ${#DOWNLOAD_CODE_LIST[@]}

slideNumber=1
codeIndex=0
for code in ${DOWNLOAD_CODE_LIST[@]}; do
    echo "slideNumber: ${slideNumber}, codeIndex:${codeIndex}, code: ${code}"

    codeWithoutLineFeedCode=`echo ${code} | awk '{printf "%s",$0}' `

    # TODO fix, 置き換え後、ダウンロードコードの行が改行される
    # macOS内のBSD版sedではバックアップファイルが作成されるため、明示的に拡張子を指定して、実行後に削除する
    sed -i '.bak' -e 's/__DLCODE_'${codeIndex}'</'${codeWithoutLineFeedCode}'</' ${WORKDIR}ppt/slides/slide${slideNumber}.xml
    rm ${WORKDIR}ppt/slides/slide${slideNumber}.xml.bak

     # replace QRCode image
     qrencode -l Q -m 0 -o ${WORKDIR}ppt/media/image_${slideNumber}_${codeIndex}.png "${DLCODE_URL}/d/?c=${code}"

    (( codeIndex++ ))

    if [[ codeIndex -eq MAX_CODE_COUNT ]]; then
        codeIndex=0
        (( slideNumber++ ))
    fi

done

## TODO: make one-line
cd ${WORKDIR}
zip --quiet -r ${GENERATE_FILE_PATH} ./*
echo "unzip. path ${GENERATE_FILE_PATH}"

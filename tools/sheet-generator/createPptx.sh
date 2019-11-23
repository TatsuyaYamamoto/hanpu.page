#!/bin/bash -eu

SCRIPT_DIR=$(cd $(dirname $0); pwd)

#
OUTPUT_DIR="${SCRIPT_DIR}/dist"

#
TEMPLATE_CODE_DIR="${SCRIPT_DIR}/src"

#
NOW=`date "+%Y%m%d_%H%M%S"`

#
WORKDIR="/tmp/dl-code-pptx_${NOW}/"

#
GENERATE_FILE_PATH=${OUTPUT_DIR}/dl-code_${NOW}.pptx

#
DLCODE_URL="https://dl-code.web.app"

#
MIN_CODE_NUMBER=2

#
MAX_CODE_NUMBER=13

#
TEMPLATE_BORDER_COLOR="00B050"

#
dlcode_csv_file_path=$1


echo "== load csv file ======================================================================="
download_code_list=()
while read code; do
    if [[ -z ${code} ]]; then
        continue
    fi

    download_code_list+=(${code})
done < ${dlcode_csv_file_path}

download_code_length=${#download_code_list[@]}
echo code size: ${download_code_length}

# TODO: 全体で最後のコードか判定する。入力したcodeの数がMAX_CODE_NUMBERの倍数でない場合、pptx作成処理が走らない。
if [[ $((${download_code_length} % 12)) -ne 0 ]]; then
  echo "dl-code list length should be multiple of 12."
  exit 1
fi

echo " == create dist dir ======================================================================="
mkdir -p ${OUTPUT_DIR}


echo " == generate sheets ======================================================================="

sheetNumber=1
codeNumber=${MIN_CODE_NUMBER}

for code in ${download_code_list[@]}; do
    # 改行をコードを取り除くために、先頭の8文字を抽出する。
    # `echo ${code} | awk '{printf "%s",$0}'` やら、`echo ${code} | sed 's/:/\'$'\n/g'` では取り除くことができなかった。
    codeWithoutLineFeedCode=${code:0:8}

    echo " == sheet number: ${sheetNumber}, code number:${codeNumber}, code: ${codeWithoutLineFeedCode} ====="

    if [[ ${codeNumber} -eq ${MIN_CODE_NUMBER} ]]; then
        echo " == first code for ${sheetNumber} sheet. ====="

        tmp_dir=$(mktemp -d)
        echo "tmp dir: ${tmp_dir}"

        tmp_src_dir="${tmp_dir}/src"
        slide_file_path="${tmp_src_dir}/ppt/slides/slide1.xml"
        image_file_base_path="${tmp_src_dir}/ppt/media/image"

        cp -r ${TEMPLATE_CODE_DIR} ${tmp_dir}
    fi

    echo " == replace download code ====="
    # macOS内のBSD版sedではバックアップファイルが作成されるため、明示的に拡張子を指定して、実行後に削除する
    sed -i '.bak' -e 's/__DLCODE_'${codeNumber}'</'${codeWithoutLineFeedCode}'</' "${slide_file_path}"
    rm "${slide_file_path}.bak"

    echo " == replace replace QRCode image ====="
     qrencode -l Q -m 0 -o "${image_file_base_path}${codeNumber}.png" "${DLCODE_URL}/d/?c=${codeWithoutLineFeedCode}"

    (( codeNumber++ ))

    if [[ ${codeNumber} -gt ${MAX_CODE_NUMBER} ]]; then
        echo " == last code for ${sheetNumber} sheet. ====="

        echo " == whiten border color ===="
        # macOS内のBSD版sedではバックアップファイルが作成されるため、明示的に拡張子を指定して、実行後に削除する
        sed -i '.bak' -e 's/'${TEMPLATE_BORDER_COLOR}'/FFFFFF/' "${slide_file_path}"
        rm "${slide_file_path}.bak"

        cd ${tmp_src_dir}
        zip --quiet --recurse-paths "${OUTPUT_DIR}/dlcode_${NOW}_${sheetNumber}.pptx" *

        codeNumber=${MIN_CODE_NUMBER}
        (( sheetNumber++ ))
    fi

done

echo "finish. see ${OUTPUT_DIR}/dlcode_${NOW}_*.pptx"

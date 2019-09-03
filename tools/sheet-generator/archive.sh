#!/bin/bash -xe

SCRIPT_DIR=$(cd $(dirname $0); pwd)
SOURCE_DIR="${SCRIPT_DIR}/src"
ARCHIVE_FILE_PATH="${SCRIPT_DIR}/template.pptx"

cd ${SOURCE_DIR}
zip -r ${ARCHIVE_FILE_PATH} *

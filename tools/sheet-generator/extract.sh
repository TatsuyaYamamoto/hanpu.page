#!/bin/bash -xe

SCRIPT_DIR=$(dirname $0)
SOURCE_DIR="${SCRIPT_DIR}/src"

target_file_path=$1

unzip ${target_file_path} -d ${SOURCE_DIR}

# https://qiita.com/fieldville/items/e0761ba9202961a95cb2
find ${SOURCE_DIR} -name '*.xml' | sed 's@.*@xmllint --format & > &.new \&\& mv &.new &@' | sh

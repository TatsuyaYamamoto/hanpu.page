import format from "date-fns/format";

/**
 * Convert file size to human-readable
 *
 * @param bytes
 * @param decimalPoint
 * @link https://www.codexworld.com/how-to/convert-file-size-bytes-kb-mb-gb-javascript/
 */
export const formatFileSize = (bytes: number, decimalPoint: number = 2) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1000;
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizeValue = parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPoint));
  return `${sizeValue} ${units[i]}`;
};

export const formatyyyyMMdd = (date: Date) => {
  return format(date, "yyyy/MM/dd");
};

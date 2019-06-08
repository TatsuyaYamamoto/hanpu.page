import { storage } from "firebase/app";

export const downloadFromFirebaseStorage = async (
  storageUrl: string,
  originalName: string
): Promise<void> => {
  const downloadUrl = await storage()
    .refFromURL(storageUrl)
    .getDownloadURL();

  const xhr = new XMLHttpRequest();
  xhr.responseType = "blob";

  const onProgress = (event: ProgressEvent) => {
    const { loaded, total, lengthComputable } = event;

    if (lengthComputable) {
      const percentComplete = (loaded / total) * 100;
      // ...
    } else {
      // 全体の長さが不明なため、進捗情報を計算できない
    }
  };

  const onLoad = (event: ProgressEvent) => {
    const blob = xhr.response;
    const a = document.createElement("a");
    a.download = originalName;
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onError = (event: ProgressEvent) => {
    //
  };

  const onAbort = (event: ProgressEvent) => {
    //
  };

  xhr.addEventListener("progress", onProgress);
  xhr.addEventListener("load", onLoad);
  xhr.addEventListener("error", onError);
  xhr.addEventListener("abort", onAbort);
  xhr.open("GET", downloadUrl);
  xhr.send();
};

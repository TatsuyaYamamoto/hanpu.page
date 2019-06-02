import { storage } from "firebase/app";

export const downloadFromFirebaseStorage = async (
  storageUrl: string,
  originalName: string
): Promise<void> => {
  const downloadURL = await storage()
    .refFromURL(storageUrl)
    .getDownloadURL();

  // TODO: CORSの対策
  // ダウンロードではなくファイルページへの遷移になっている
  const a = document.createElement("a");
  a.download = originalName;
  a.href = downloadURL;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

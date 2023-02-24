import Toast from "react-native-toast-message";
import toFormData from "./toFormData";
import uriToFileMeta from "./uriToFileMeta";

// eslint-disable-next-line
export default async function uploadToS3(uri: string, upload: any) {
  const fileMeta = uriToFileMeta(uri);
  if (!fileMeta) return;
  try {
    await fetch(upload.url, {
      method: "POST",
      body: toFormData({
        ...upload.fields,
        "Content-Type": fileMeta.type,
        file: fileMeta,
      }),
    });
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Hiba történt",
      text2: "Nem sikerült feltölteni a képet!",
    });
  }
}

export type FileMeta = {
  uri: string;
  name: string;
  type: string;
};

export default function uriToFileMeta(uri: string): FileMeta | null {
  const fileName = uri.split("/").pop();
  if (!fileName) return null;

  const fileType = fileName.split(".").pop();
  if (!fileType) return null;

  return {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  };
}

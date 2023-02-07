import S3 from "aws-sdk/clients/s3";
import tk from "timekeeper";

const MAX_IMG_SIZE = 10000000;
const UPLOAD_EXPIRES = 60; // seconds
const DOWNLOAD_EXPIRES = 60 * 60; //seconds
const URL_CACHING_TIME = 45; // minutes;

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

function getTruncatedTime() {
  const currentTime = new Date();
  const d = new Date(currentTime);

  d.setMinutes(
    Math.floor(d.getMinutes() / URL_CACHING_TIME) * URL_CACHING_TIME
  );
  d.setSeconds(0);
  d.setMilliseconds(0);

  return d;
}

export function uploadImage(key: string) {
  return s3.createPresignedPost({
    Fields: {
      key,
    },
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, MAX_IMG_SIZE],
    ],
    Expires: UPLOAD_EXPIRES,
    Bucket: process.env.AWS_BUCKET_NAME,
  });
}

export function retrieveImage(key: string) {
  return tk.withFreeze(getTruncatedTime(), () =>
    s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: DOWNLOAD_EXPIRES,
    })
  );
}

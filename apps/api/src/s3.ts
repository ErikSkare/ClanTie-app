import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export async function uploadImage(key: string) {
  return await s3.createPresignedPost({
    Fields: {
      key,
    },
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, 1000000],
    ],
    Expires: 60,
    Bucket: process.env.AWS_BUCKET_NAME,
  });
}

export async function retrieveImage(key: string) {
  return await s3.getSignedUrlPromise("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
}

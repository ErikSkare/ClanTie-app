import S3 from "aws-sdk/clients/s3";
export declare function uploadImage(key: string): S3.PresignedPost;
export declare function retrieveImage(key: string): string;

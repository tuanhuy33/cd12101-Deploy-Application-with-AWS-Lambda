import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {createLogger} from "../utils/logger.mjs";

const s3Client = new S3Client({ region: "us-east-1" });
const logger = createLogger('attachmentUtils')

export async function getUploadUrl(attachmentId) {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: attachmentId,
        });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        logger.info(`signedUrl: ${signedUrl}`);

        return signedUrl;
    } catch (error) {
        logger.error(`Error getting signed URL: ${error}`);
        throw new Error("Error generating signed URL");
    }
}
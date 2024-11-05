import { createLogger } from '../utils/logger.mjs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const logger = createLogger('AttachmentUtils')
const s3_bucket_name = process.env.ATTACHMENT_S3_BUCKET
const client = new S3Client({ region: 'us-east-1' })
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export class AttachmentUtils {

    constructor(bucket_name = s3_bucket_name) {
        this.bucket_name = bucket_name;
    }

    async getAttachmentUrl(todoId) {
        try {
            const s3Url = `https://${this.bucket_name}.s3.amazonaws.com/${todoId}`;
            logger.info(`Generated attachment URL for todoId: ${todoId}`);
            return s3Url;
        } catch (error) {
            logger.error(`Generating attachment URL for todoId error: ${todoId}`, error);
            throw error;
        }
    }

    async generateUploadUrl(todoId) {
        const command = new PutObjectCommand({
            Bucket: this.bucket_name,
            Key: todoId
        });
        const uploadUrl = await getSignedUrl(client, command, { expiresIn: urlExpiration })
        return uploadUrl
    }

}
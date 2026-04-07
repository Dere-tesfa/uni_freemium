import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../lib/logger.server';

class FileService {
  private s3: S3Client | null = null;
  private bucketName = process.env.AWS_S3_BUCKET || 'uniexam-hub-bucket';

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (region && accessKeyId && secretAccessKey) {
      this.s3 = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      logger.warn('AWS credentials not fully configured. File uploads will be disabled.');
    }
  }

  /**
   * Uploads a file buffer to S3 and returns the public URL
   */
  async uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    if (!this.s3) {
      logger.warn('Attempted to upload file but S3 client is not configured. Saving locally disabled for now.');
      return '/uploads/' + originalName; // Fallback or mock behavior
    }

    const key = `uploads/${Date.now()}_${originalName.replace(/\s+/g, '-')}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.s3.send(command);

      // Return public URL (assuming bucket is public or we serve via cloudfront)
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      logger.error({ err: error }, 'Error uploading file to S3:');
      throw new Error('Failed to upload file');
    }
  }
}

export const fileService = new FileService();

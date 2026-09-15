import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

export interface IStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder: string): Promise<string>;
  getPresignedUploadUrl(fileName: string, mimeType: string, folder: string, expiresIn?: number): Promise<{ uploadUrl: string, finalUrl: string }>;
  deleteFile(fileUrlOrKey: string): Promise<void>;
  uploadFileDirectKey?(fileBuffer: Buffer, key: string, mimeType: string): Promise<{ objectKey: string; publicUrl: string; bucket: string }>;
}

export interface ProcessedMediaUrls {
  originalUrl: string;
  thumbnail512?: string;
  thumbnail256?: string;
  fileType: 'image' | 'video' | 'document';
}

export type EntityType = 
  | 'user_avatar' 
  | 'user_cover' 
  | 'setup_image' 
  | 'setup_video' 
  | 'setup_file' 
  | 'post_image' 
  | 'post_file' 
  | 'chat_media' 
  | 'general';

export interface EntityMediaUploadOptions {
  fileBuffer: Buffer;
  originalName: string;
  mimeType: string;
  entityType: EntityType;
  entityId: string;
  userId?: string;
  assetId?: string;
}

export interface EntityMediaResult {
  assetId: string;
  bucket: string;
  objectKey: string;
  publicUrl: string;
  thumbnail512ObjectKey?: string;
  thumbnail512PublicUrl?: string;
  thumbnail256ObjectKey?: string;
  thumbnail256PublicUrl?: string;
  fileType: 'image' | 'video' | 'document';
  mimeType: string;
  fileSize: number;
  originalFilename: string;
  entityType: EntityType;
  entityId: string;
}

export function buildEntityObjectKey(
  entityType: EntityType,
  entityId: string,
  variant: 'original' | 'thumb512' | 'thumb256' | 'file' | 'video',
  assetId: string,
  ext: string
): string {
  const safeEntityId = entityId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeAssetId = assetId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '');

  switch (entityType) {
    case 'user_avatar':
      return `users/${safeEntityId}/avatar/original/${safeAssetId}.${safeExt}`;
    case 'user_cover':
      return `users/${safeEntityId}/cover/original/${safeAssetId}.${safeExt}`;
    case 'setup_image':
      if (variant === 'thumb512') {
        return `setups/${safeEntityId}/images/thumbnails/512/${safeAssetId}.webp`;
      }
      if (variant === 'thumb256') {
        return `setups/${safeEntityId}/images/thumbnails/256/${safeAssetId}.webp`;
      }
      return `setups/${safeEntityId}/images/original/${safeAssetId}.webp`;
    case 'setup_video':
      return `setups/${safeEntityId}/videos/${safeAssetId}.${safeExt}`;
    case 'setup_file':
      return `setups/${safeEntityId}/files/${safeAssetId}.${safeExt}`;
    case 'post_image':
      if (variant === 'thumb512') {
        return `posts/${safeEntityId}/images/thumbnails/512/${safeAssetId}.webp`;
      }
      if (variant === 'thumb256') {
        return `posts/${safeEntityId}/images/thumbnails/256/${safeAssetId}.webp`;
      }
      return `posts/${safeEntityId}/images/original/${safeAssetId}.webp`;
    case 'post_file':
      return `posts/${safeEntityId}/files/${safeAssetId}.${safeExt}`;
    case 'chat_media':
      return `chat/${safeEntityId}/${safeAssetId}.${safeExt}`;
    default:
      return `general/${safeEntityId}/${safeAssetId}.${safeExt}`;
  }
}

export class CloudflareR2Provider implements IStorageProvider {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID || '';
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
    this.bucketName = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || 'setupss';
    this.publicUrl = process.env.R2_PUBLIC_URL || 'https://cdn.setupss.com';

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
      credentials: {
        accessKeyId,
        secretAccessKey,
      }
    });
  }

  getBucketName(): string {
    return this.bucketName;
  }

  getPublicUrl(): string {
    return this.publicUrl;
  }

  async uploadFileDirectKey(fileBuffer: Buffer, key: string, mimeType: string): Promise<{ objectKey: string; publicUrl: string; bucket: string }> {
    const cleanKey = key.replace(/^\/+/, '');
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: cleanKey,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);
    const baseUrl = this.publicUrl.replace(/\/$/, '');
    return {
      objectKey: cleanKey,
      publicUrl: `${baseUrl}/${cleanKey}`,
      bucket: this.bucketName
    };
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder: string): Promise<string> {
    const key = `${folder.replace(/\/$/, '')}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const directResult = await this.uploadFileDirectKey(fileBuffer, key, mimeType);
    return directResult.publicUrl;
  }

  async getPresignedUploadUrl(fileName: string, mimeType: string, folder: string, expiresIn = 3600): Promise<{ uploadUrl: string, finalUrl: string }> {
    const key = `${folder.replace(/\/$/, '')}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
    const finalUrl = `${this.publicUrl.replace(/\/$/, '')}/${key}`;
    return { uploadUrl, finalUrl };
  }

  async deleteFile(fileUrlOrKey: string): Promise<void> {
    let key = fileUrlOrKey;
    if (fileUrlOrKey.startsWith('http://') || fileUrlOrKey.startsWith('https://')) {
       try {
         const parsed = new URL(fileUrlOrKey);
         key = parsed.pathname.replace(/^\/+/, '');
       } catch {
         const publicUrlDomain = this.publicUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
         const urlWithoutProtocol = fileUrlOrKey.replace(/^https?:\/\//, '');
         if (urlWithoutProtocol.startsWith(publicUrlDomain)) {
            key = urlWithoutProtocol.substring(publicUrlDomain.length + 1);
         }
       }
    } else {
      key = fileUrlOrKey.replace(/^\/+/, '');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}

export class LocalStorageProvider implements IStorageProvider {
  private publicUrl: string;

  constructor() {
    this.publicUrl = process.env.PUBLIC_URL || '';
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder: string): Promise<string> {
    const cleanFolder = folder.replace(/\/$/, '');
    const uploadsDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, key);
    fs.writeFileSync(filePath, fileBuffer);

    return `/uploads/${cleanFolder}/${key}`;
  }

  async getPresignedUploadUrl(fileName: string, mimeType: string, folder: string, expiresIn = 3600): Promise<{ uploadUrl: string, finalUrl: string }> {
    const cleanFolder = folder.replace(/\/$/, '');
    const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const finalUrl = `/uploads/${cleanFolder}/${key}`;
    return { uploadUrl: `/api/upload-direct?path=${encodeURIComponent(finalUrl)}`, finalUrl };
  }

  async deleteFile(fileUrlOrKey: string): Promise<void> {
    if (fileUrlOrKey.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), "public", fileUrlOrKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}

/**
 * Detect real MIME type and file extension from raw file buffer (Magic Numbers).
 */
export function detectMimeTypeFromBuffer(buffer: Buffer): { mime: string; ext: string } | null {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { mime: 'image/png', ext: 'png' };
  }

  // GIF: 47 49 46 38 ("GIF8")
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { mime: 'image/gif', ext: 'gif' };
  }

  // WebP: RIFF (0..3) and WEBP (8..11)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return { mime: 'image/webp', ext: 'webp' };
  }

  // PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { mime: 'application/pdf', ext: 'pdf' };
  }

  // MP4: ftyp starting at index 4 (66 74 79 70)
  if (
    buffer.length >= 8 &&
    buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70
  ) {
    return { mime: 'video/mp4', ext: 'mp4' };
  }

  // WebM: 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { mime: 'video/webm', ext: 'webm' };
  }

  // SVG: Check if text starts with XML tag or <svg (XML/SVG)
  const textContent = buffer.slice(0, 1024).toString('utf-8').trim().toLowerCase();
  if (textContent.includes('<svg') || textContent.includes('<?xml')) {
    return { mime: 'image/svg+xml', ext: 'svg' };
  }

  return null;
}

/**
 * Sanitize SVG strings by stripping all script tags and interactive/event handler attributes.
 * Prevents XSS attacks.
 */
export function sanitizeSvg(buffer: Buffer): Buffer {
  let svgString = buffer.toString('utf-8');
  
  // Strip script tags recursively
  svgString = svgString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Strip onload, onerror, onclick, etc. event handler attributes
  svgString = svgString.replace(/\bon[a-z]+\s*=\s*["'][^"']*["']/gi, '');
  svgString = svgString.replace(/\bon[a-z]+\s*=\s*[^\s>]+/gi, '');
  
  // Strip javascript: protocol URIs
  svgString = svgString.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  
  return Buffer.from(svgString, 'utf-8');
}

/**
 * Storage Abstraction Layer with built-in Sharp Image Processing Pipeline.
 */
class StorageService {
  private provider: IStorageProvider;

  constructor() {
    const isR2Configured = 
      !!process.env.R2_ACCOUNT_ID && 
      !!process.env.R2_ACCESS_KEY_ID && 
      !!process.env.R2_SECRET_ACCESS_KEY && 
      (!!process.env.R2_BUCKET || !!process.env.R2_BUCKET_NAME);

    if (isR2Configured) {
      this.provider = new CloudflareR2Provider();
      console.log("StorageService: Cloudflare R2 Provider initialized.");
    } else {
      this.provider = new LocalStorageProvider();
      console.warn("StorageService: R2 credentials not fully specified. Falling back to LocalStorageProvider.");
    }
  }

  getProvider(): IStorageProvider {
    return this.provider;
  }

  /**
   * Helper to format an object key into a canonical CDN public URL.
   */
  formatCdnUrl(objectKey: string): string {
    const cleanKey = objectKey.replace(/^\/+/, '');
    const cdnBase = (process.env.R2_PUBLIC_URL || 'https://cdn.setupss.com').replace(/\/$/, '');
    return `${cdnBase}/${cleanKey}`;
  }

  /**
   * Helper to extract relative object key from a full public or R2 URL.
   */
  extractObjectKey(urlOrKey: string): string {
    if (!urlOrKey) return '';
    if (urlOrKey.startsWith('http://') || urlOrKey.startsWith('https://')) {
      try {
        const parsed = new URL(urlOrKey);
        return parsed.pathname.replace(/^\/+/, '');
      } catch {
        const cdnBase = (process.env.R2_PUBLIC_URL || 'https://cdn.setupss.com').replace(/^https?:\/\//, '').replace(/\/$/, '');
        const withoutProto = urlOrKey.replace(/^https?:\/\//, '');
        if (withoutProto.startsWith(cdnBase)) {
          return withoutProto.substring(cdnBase.length + 1).replace(/^\/+/, '');
        }
        return urlOrKey;
      }
    }
    return urlOrKey.replace(/^\/+/, '');
  }

  /**
   * Canonical Entity-Aware Production Media Upload Pipeline.
   * Uploads media files into strict entity-aware object key namespaces
   * (e.g. setups/{setupId}/images/original/{assetId}.webp)
   */
  async uploadEntityMedia(options: EntityMediaUploadOptions): Promise<EntityMediaResult> {
    const { fileBuffer, originalName, mimeType, entityType, entityId, assetId = `ast_${Date.now()}_${Math.random().toString(36).substring(2, 8)}` } = options;

    const detected = detectMimeTypeFromBuffer(fileBuffer);
    if (!detected) {
      throw new Error("Geçersiz veya desteklenmeyen dosya formatı.");
    }

    const verifiedMimeType = detected.mime;
    let processedBuffer = fileBuffer;

    if (verifiedMimeType === 'image/svg+xml') {
      processedBuffer = sanitizeSvg(fileBuffer);
    }

    const isVideo = verifiedMimeType.startsWith('video/');
    const isImage = verifiedMimeType.startsWith('image/') && verifiedMimeType !== 'image/svg+xml';
    const activeBucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || 'setupss';

    if (isVideo) {
      const objectKey = buildEntityObjectKey(entityType, entityId, 'video', assetId, detected.ext);
      if (this.provider.uploadFileDirectKey) {
        const res = await this.provider.uploadFileDirectKey(processedBuffer, objectKey, verifiedMimeType);
        return {
          assetId,
          bucket: res.bucket,
          objectKey: res.objectKey,
          publicUrl: res.publicUrl,
          fileType: 'video',
          mimeType: verifiedMimeType,
          fileSize: processedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      } else {
        const publicUrl = await this.provider.uploadFile(processedBuffer, `${assetId}.${detected.ext}`, verifiedMimeType, `videos/${entityId}`);
        return {
          assetId,
          bucket: activeBucket,
          objectKey,
          publicUrl,
          fileType: 'video',
          mimeType: verifiedMimeType,
          fileSize: processedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      }
    }

    if (!isImage) {
      const objectKey = buildEntityObjectKey(entityType, entityId, 'file', assetId, detected.ext);
      if (this.provider.uploadFileDirectKey) {
        const res = await this.provider.uploadFileDirectKey(processedBuffer, objectKey, verifiedMimeType);
        return {
          assetId,
          bucket: res.bucket,
          objectKey: res.objectKey,
          publicUrl: res.publicUrl,
          fileType: verifiedMimeType === 'image/svg+xml' ? 'image' : 'document',
          mimeType: verifiedMimeType,
          fileSize: processedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      } else {
        const publicUrl = await this.provider.uploadFile(processedBuffer, `${assetId}.${detected.ext}`, verifiedMimeType, `files/${entityId}`);
        return {
          assetId,
          bucket: activeBucket,
          objectKey,
          publicUrl,
          fileType: verifiedMimeType === 'image/svg+xml' ? 'image' : 'document',
          mimeType: verifiedMimeType,
          fileSize: processedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      }
    }

    // Process Image via Sharp
    try {
      const origObjectKey = buildEntityObjectKey(entityType, entityId, 'original', assetId, 'webp');
      const thumb512ObjectKey = buildEntityObjectKey(entityType, entityId, 'thumb512', assetId, 'webp');
      const thumb256ObjectKey = buildEntityObjectKey(entityType, entityId, 'thumb256', assetId, 'webp');

      const originalOptimizedBuffer = await sharp(processedBuffer)
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const thumb512Buffer = await sharp(processedBuffer)
        .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      const thumb256Buffer = await sharp(processedBuffer)
        .resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      if (this.provider.uploadFileDirectKey) {
        const [origRes, t512Res, t256Res] = await Promise.all([
          this.provider.uploadFileDirectKey(originalOptimizedBuffer, origObjectKey, 'image/webp'),
          this.provider.uploadFileDirectKey(thumb512Buffer, thumb512ObjectKey, 'image/webp'),
          this.provider.uploadFileDirectKey(thumb256Buffer, thumb256ObjectKey, 'image/webp')
        ]);

        return {
          assetId,
          bucket: origRes.bucket,
          objectKey: origRes.objectKey,
          publicUrl: origRes.publicUrl,
          thumbnail512ObjectKey: t512Res.objectKey,
          thumbnail512PublicUrl: t512Res.publicUrl,
          thumbnail256ObjectKey: t256Res.objectKey,
          thumbnail256PublicUrl: t256Res.publicUrl,
          fileType: 'image',
          mimeType: 'image/webp',
          fileSize: originalOptimizedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      } else {
        const [origUrl, t512Url, t256Url] = await Promise.all([
          this.provider.uploadFile(originalOptimizedBuffer, `${assetId}.webp`, 'image/webp', `setups/${entityId}/original`),
          this.provider.uploadFile(thumb512Buffer, `512_${assetId}.webp`, 'image/webp', `setups/${entityId}/thumb512`),
          this.provider.uploadFile(thumb256Buffer, `256_${assetId}.webp`, 'image/webp', `setups/${entityId}/thumb256`)
        ]);

        return {
          assetId,
          bucket: activeBucket,
          objectKey: origObjectKey,
          publicUrl: origUrl,
          thumbnail512ObjectKey: thumb512ObjectKey,
          thumbnail512PublicUrl: t512Url,
          thumbnail256ObjectKey: thumb256ObjectKey,
          thumbnail256PublicUrl: t256Url,
          fileType: 'image',
          mimeType: 'image/webp',
          fileSize: originalOptimizedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      }
    } catch (error) {
      console.error("Sharp processing failed in uploadEntityMedia, falling back to original upload:", error);
      const origObjectKey = buildEntityObjectKey(entityType, entityId, 'original', assetId, detected.ext);
      if (this.provider.uploadFileDirectKey) {
        const res = await this.provider.uploadFileDirectKey(processedBuffer, origObjectKey, verifiedMimeType);
        return {
          assetId,
          bucket: res.bucket,
          objectKey: res.objectKey,
          publicUrl: res.publicUrl,
          fileType: 'image',
          mimeType: verifiedMimeType,
          fileSize: processedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      } else {
        const publicUrl = await this.provider.uploadFile(processedBuffer, `${assetId}.${detected.ext}`, verifiedMimeType, `original/${entityId}`);
        return {
          assetId,
          bucket: activeBucket,
          objectKey: origObjectKey,
          publicUrl,
          fileType: 'image',
          mimeType: verifiedMimeType,
          fileSize: processedBuffer.length,
          originalFilename: originalName,
          entityType,
          entityId
        };
      }
    }
  }

  /**
   * Process and optimize an uploaded image or file.
   * - Converts images to optimized WebP formats.
   * - Generates 512px and 256px thumbnails.
   * - Uploads them to the target provider.
   */
  async processAndUploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: 'avatars' | 'setup' | 'hardware' | 'covers' | 'banners' | 'temp' | 'reports'
  ): Promise<ProcessedMediaUrls> {
    // 1. Validate file with Magic Numbers (real MIME detection)
    const detected = detectMimeTypeFromBuffer(fileBuffer);
    if (!detected) {
      throw new Error("Geçersiz veya desteklenmeyen dosya formatı.");
    }

    // Strict allowed list for our setups and application platform
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'video/mp4',
      'video/webm'
    ];

    if (!allowedMimeTypes.includes(detected.mime)) {
      throw new Error(`Dosya tipi (${detected.mime}) desteklenmemektedir.`);
    }

    // Override incoming headers to match verified magic numbers
    const verifiedMimeType = detected.mime;
    let processedBuffer = fileBuffer;

    // 2. SVG XSS Protection (Sanitization)
    if (verifiedMimeType === 'image/svg+xml') {
      processedBuffer = sanitizeSvg(fileBuffer);
    }

    // 3. Enforce secure, sanitized names and force correct physical extension
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');
    const secureFileName = `${sanitizedName}.${detected.ext}`;

    const isVideo = verifiedMimeType.startsWith('video/');
    const isImage = verifiedMimeType.startsWith('image/') && verifiedMimeType !== 'image/svg+xml';

    if (isVideo) {
      // Direct upload for video files
      const url = await this.provider.uploadFile(processedBuffer, secureFileName, verifiedMimeType, `${folder}/original`);
      return {
        originalUrl: url,
        fileType: 'video'
      };
    }

    if (!isImage) {
      // Non-image file upload as is (e.g., pdf, svg)
      const url = await this.provider.uploadFile(processedBuffer, secureFileName, verifiedMimeType, `${folder}/original`);
      return {
        originalUrl: url,
        fileType: verifiedMimeType === 'image/svg+xml' ? 'image' : 'document'
      };
    }

    // Process Image using Sharp (JPEG, PNG, WEBP, GIF etc.)
    const timestamp = Date.now();
    const baseWebpName = `${timestamp}_${sanitizedName}`;

    try {
      // 1. Original optimized version (max 1920px)
      const originalOptimizedBuffer = await sharp(processedBuffer)
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      // 2. Thumbnail 512 version
      const thumb512Buffer = await sharp(processedBuffer)
        .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      // 3. Thumbnail 256 version
      const thumb256Buffer = await sharp(processedBuffer)
        .resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      // Upload processed files
      const [originalUrl, thumb512Url, thumb256Url] = await Promise.all([
        this.provider.uploadFile(originalOptimizedBuffer, `${baseWebpName}.webp`, 'image/webp', `${folder}/original`),
        this.provider.uploadFile(thumb512Buffer, `512_${baseWebpName}.webp`, 'image/webp', `${folder}/thumb`),
        this.provider.uploadFile(thumb256Buffer, `256_${baseWebpName}.webp`, 'image/webp', `${folder}/thumb`),
      ]);

      return {
        originalUrl,
        thumbnail512: thumb512Url,
        thumbnail256: thumb256Url,
        fileType: 'image'
      };
    } catch (error) {
      console.error("Sharp processing failed, falling back to original file upload:", error);
      // Fallback if sharp fails
      const url = await this.provider.uploadFile(processedBuffer, secureFileName, verifiedMimeType, `${folder}/original`);
      return {
        originalUrl: url,
        fileType: 'image'
      };
    }
  }
}

export const storageService = new StorageService();

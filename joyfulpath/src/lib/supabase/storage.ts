import { createClient } from './client';

export const STORAGE_BUCKETS = {
  LESSONS: 'lessons',
  HOMEWORK: 'homework',
  PROFILES: 'profiles',
  ATTACHMENTS: 'attachments',
} as const;

export const ALLOWED_FILE_TYPES: Record<keyof typeof STORAGE_BUCKETS, readonly string[]> = {
  LESSONS: ['application/pdf', 'video/mp4', 'video/webm', 'image/png', 'image/jpeg'],
  HOMEWORK: ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ATTACHMENTS: ['application/pdf', 'image/*', 'video/*', 'audio/*'],
  PROFILES: ['image/png', 'image/jpeg'],
};

export const MAX_FILE_SIZES: Record<keyof typeof STORAGE_BUCKETS, number> = {
  LESSONS: 100 * 1024 * 1024, // 100MB
  HOMEWORK: 10 * 1024 * 1024, // 10MB
  PROFILES: 5 * 1024 * 1024, // 5MB
  ATTACHMENTS: 50 * 1024 * 1024, // 50MB
};

interface UploadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  path: string;
  file: File;
}

export async function uploadFile({ bucket, path, file }: UploadOptions) {
  try {
    const supabase = createClient();
    const bucketName = STORAGE_BUCKETS[bucket];
    
    // Validate file size
    const maxSize = MAX_FILE_SIZES[bucket];
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
    }

    // Validate file type
    const allowedTypes = ALLOWED_FILE_TYPES[bucket];
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('*')) {
        return file.type.startsWith(type.slice(0, -2));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      throw new Error(`File type ${file.type} is not allowed for ${bucket}`);
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
}

export async function deleteFile(bucket: keyof typeof STORAGE_BUCKETS, path: string) {
  try {
    const supabase = createClient();
    const bucketName = STORAGE_BUCKETS[bucket];

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Delete error:', error);
    throw new Error(error.message || 'Failed to delete file');
  }
}

export function getPublicUrl(bucket: keyof typeof STORAGE_BUCKETS, path: string): string {
  const supabase = createClient();
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  return publicUrl;
}

'use client';

import { useEffect, useRef, useState } from 'react';

const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const PART_SIZE_BYTES = 10 * 1024 * 1024;

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  fileName: string;
}

interface R2VideoUploadProps {
  onUploadComplete: (result: UploadResult) => void;
  onUploadStart?: () => void;
}

export function R2VideoUpload({ onUploadComplete, onUploadStart }: R2VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload MP4, MOV, or WebM.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setUploadedUrl(null);
    setUploadProgress(0);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    generateThumbnail(selectedFile, url);
  };

  const generateThumbnail = (selectedFile: File, objectUrl: string) => {
    const video = document.createElement('video');
    video.src = objectUrl;
    video.preload = 'metadata';
    video.muted = true;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || undefined);
      const captureTime = Math.min(1, video.duration / 2);
      video.currentTime = captureTime;
    };

    const handleSeeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.8));
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const uploadWithProgress = (url: string, blob: Blob, contentType?: string) =>
    new Promise<string | null>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      if (contentType) {
        xhr.setRequestHeader('Content-Type', contentType);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const etag = xhr.getResponseHeader('ETag') || xhr.getResponseHeader('etag');
          resolve(etag ? etag.replace(/"/g, '') : null);
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(blob);
    });

  const uploadPart = (
    url: string,
    blob: Blob,
    onProgress: (loadedBytes: number) => void
  ) =>
    new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(event.loaded);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const etag = xhr.getResponseHeader('ETag') || xhr.getResponseHeader('etag');
          if (!etag) {
            reject(new Error('Missing ETag from upload response'));
            return;
          }
          resolve(etag.replace(/"/g, ''));
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(blob);
    });

  const uploadVideo = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);
      onUploadStart?.();

      // Use Next.js API routes
      if (file.size <= PART_SIZE_BYTES) {
        const presignResponse = await fetch('/api/videos/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, contentType: file.type }),
        });

        if (!presignResponse.ok) {
          throw new Error('Failed to generate upload URL');
        }

        const presignData = await presignResponse.json();
        await uploadWithProgress(presignData.url, file, file.type);
        setUploadedUrl(presignData.publicUrl);
        onUploadComplete({
          url: presignData.publicUrl,
          thumbnailUrl: thumbnailUrl || undefined,
          duration,
          fileName: file.name,
        });
        setUploadProgress(100);
        return;
      }

      const initiateResponse = await fetch('/api/videos/multipart/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!initiateResponse.ok) {
        throw new Error('Failed to initiate multipart upload');
      }

      const initiateData = await initiateResponse.json();
      const parts: { partNumber: number; etag: string }[] = [];
      let uploadedBytes = 0;

      for (const part of initiateData.parts as { partNumber: number; url: string }[]) {
        const start = (part.partNumber - 1) * initiateData.partSize;
        const end = Math.min(start + initiateData.partSize, file.size);
        const blob = file.slice(start, end);

        const etag = await uploadPart(part.url, blob, (loadedBytes) => {
          setUploadProgress(
            Math.round(((uploadedBytes + loadedBytes) / file.size) * 100)
          );
        });

        uploadedBytes += blob.size;
        parts.push({ partNumber: part.partNumber, etag });
      }

      const completeResponse = await fetch('/api/videos/multipart/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: initiateData.key,
          uploadId: initiateData.uploadId,
          parts,
        }),
      });

      if (!completeResponse.ok) {
        throw new Error('Failed to complete multipart upload');
      }

      const completeData = await completeResponse.json();
      setUploadedUrl(completeData.publicUrl);
      setUploadProgress(100);
      onUploadComplete({
        url: completeData.publicUrl,
        thumbnailUrl: thumbnailUrl || undefined,
        duration,
        fileName: file.name,
      });
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) handleFileSelect(selectedFile);
          }}
        />

        <div className="text-gray-700 dark:text-gray-300">
          <p className="text-lg font-semibold">Drag & drop your video</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            MP4, MOV, or WebM · up to 500MB+
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose File
          </button>
        </div>
      </div>

      {file && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{file.name}</span>
            <span>
              {(file.size / (1024 * 1024)).toFixed(1)} MB · {file.type || 'Unknown type'}
            </span>
          </div>

          {thumbnailUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <img
                src={thumbnailUrl}
                alt="Video thumbnail preview"
                className="w-full max-h-64 object-cover"
              />
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                Thumbnail preview
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
              <video src={previewUrl} className="w-full aspect-video" controls />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={uploadVideo}
              disabled={uploading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                uploading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? 'Uploading…' : 'Upload to R2'}
            </button>
            {uploadedUrl && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Upload complete
              </span>
            )}
          </div>

          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          {uploadedUrl && (
            <div className="text-xs text-gray-500 dark:text-gray-400 break-all p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <strong>Uploaded URL:</strong> {uploadedUrl}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

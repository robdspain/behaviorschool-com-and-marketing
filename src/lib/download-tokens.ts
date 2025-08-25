// Shared token store for download protection
// In production, replace with Redis or database

export interface DownloadToken {
  email: string;
  resource: string;
  expires: number;
  used: boolean;
}

export const downloadTokens = new Map<string, DownloadToken>();

// Clean expired tokens every hour
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    const now = Date.now();
    for (const [token, data] of downloadTokens.entries()) {
      if (data.expires < now) {
        downloadTokens.delete(token);
      }
    }
  }, 3600000);
}
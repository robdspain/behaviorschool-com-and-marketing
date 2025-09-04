"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Lock } from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

interface SecureDownloadButtonProps {
  resource: string;
  fileName: string;
  title?: string;
  className?: string;
}

export default function SecureDownloadButton({ 
  resource, 
  fileName, 
  title = "Download", 
  className = "" 
}: SecureDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  const checkAuthAndDownload = async () => {
    setIsDownloading(true);
    
    try {
      if (!supabaseClient) {
        // If Supabase is not configured, redirect to login
        router.push('/admin/login');
        return;
      }

      // Check if user is authenticated
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      
      if (error || !session) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/admin/login?returnTo=${returnUrl}`);
        return;
      }

      // User is authenticated, proceed with download
      const response = await fetch(`/api/download/${resource}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/admin/login?returnTo=${returnUrl}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Download failed. Please try again.');
        return;
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please check your connection and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      size="lg"
      className={`bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 h-12 text-base font-semibold ${className}`}
      onClick={checkAuthAndDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
          Preparing Download...
        </>
      ) : (
        <>
          <Lock className="mr-2 w-5 h-5" />
          <Download className="mr-2 w-5 h-5" />
          {title}
        </>
      )}
    </Button>
  );
}
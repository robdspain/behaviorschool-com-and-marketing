"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import DownloadPopup from "./DownloadPopup";

interface SimpleDownloadButtonProps {
  resource: string;
  fileName: string;
  title: string;
  buttonText?: string;
  className?: string;
  size?: "sm" | "lg";
  variant?: "default" | "outline";
}

export default function SimpleDownloadButton({ 
  resource, 
  fileName, 
  title,
  buttonText = "Download Free PDF", 
  className = "",
  size = "lg",
  variant = "default"
}: SimpleDownloadButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Button 
        size={size}
        variant={variant}
        className={className}
        onClick={() => setShowPopup(true)}
      >
        <Download className="mr-2 w-5 h-5" />
        {buttonText}
      </Button>

      <DownloadPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        resource={resource}
        fileName={fileName}
        title={title}
      />
    </>
  );
}
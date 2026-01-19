"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import React from "react";

interface ExternalLinkModalProps {
  children: React.ReactNode;
  href: string;
  title?: string;
  description?: string;
}

export function ExternalLinkModal({
  children,
  href,
  title = "You are leaving Behavior School",
  description = "You are about to visit our community platform. Do you want to continue?",
}: ExternalLinkModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="p-3 bg-slate-100 rounded-full">
            <ExternalLink className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-sm text-slate-500">
            Link: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{href}</span>
          </p>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              Continue to Community
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

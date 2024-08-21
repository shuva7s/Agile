"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react"; // Import both Copy and Check icons
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CopyLink({
  content,
  buttonType,
}: {
  content: string;
  buttonType: "code" | "link";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy =
      buttonType === "code"
        ? content
        : `http://localhost:3000/project/${content}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who wants to join, send this link, using this they can send a
            join request to the host.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              type="text"
              id="link"
              value={
                buttonType === "code"
                  ? content
                  : // : `http://localhost:3000/project/${content}`
                    `https://agile-one.vercel.app/project/${content}`
              }
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

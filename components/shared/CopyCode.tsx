"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const CopyCode = ({
  content,
  buttonType,
}: {
  content: string;
  buttonType: "code" | "link";
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.FormEvent) => {
    e.preventDefault();

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
    <form onSubmit={handleCopy}>
      <div className="flex gap-3">
        <Input
          type="text"
          value={
            buttonType === "code"
              ? content
              : `http://localhost:3000/project/${content}`
              // : `http://localhost:3000/project/${content}`
          }
          readOnly
        />
        <Button
          type="submit"
          variant={buttonType === "code" ? "outline" : "secondary"}
        >
          {buttonType === "code"
            ? copied
              ? "Code Copied!"
              : "Copy Code"
            : copied
            ? "Link Copied!"
            : "Copy Link"}
        </Button>
      </div>
    </form>
  );
};

export default CopyCode;

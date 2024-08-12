"use client";

import { handleJoinRequest } from "@/lib/actions/other.actions";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

type JoinRequestFormProps = {
  reqId: string;
  projectId: string;
};

const HandleJoinReqForm = ({ reqId, projectId }: JoinRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleSubmit = async (type: "accept" | "reject") => {
    setIsSubmitting(true);
    try {
      await handleJoinRequest({ reqId, projectId, type });
      router.refresh();
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      // Handle error, e.g., show an error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-row justify-end gap-2">
      <Button
        variant="secondary"
        className="w-1/2 md:w-40"
        onClick={() => handleSubmit("reject")}
        disabled={isSubmitting}
      >
        Reject
      </Button>
      <Button
        className="w-1/2 md:w-40"
        onClick={() => handleSubmit("accept")}
        disabled={isSubmitting}
      >
        Accept
      </Button>
    </form>
  );
};

export default HandleJoinReqForm;

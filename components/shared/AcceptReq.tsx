"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { deleteRequestById } from "@/lib/actions/other.actions";

interface AcceptReqProps {
  req_id: string; // The ID of the join request to delete
  projectId: string; // The ID of the project that contains the join request
}

const AcceptReq = ({ req_id, projectId }: AcceptReqProps) => {
  const router = useRouter();

  const handleGoBack = async () => {
    try {
      await deleteRequestById(req_id, projectId);
      // Refresh the page or redirect after deletion
      router.refresh();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return <Button onClick={handleGoBack}>Go Back</Button>;
};

export default AcceptReq;

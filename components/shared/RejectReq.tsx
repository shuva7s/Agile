"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { deleteRequestById } from "@/lib/actions/other.actions";

interface AcceptReqProps {
  req_id: string; // The ID of the join request to delete
  projectId: string; // The ID of the project that contains the join request
}

const RejectReq = ({ req_id, projectId }: AcceptReqProps) => {
  const router = useRouter();

  const handleGoBack = async () => {
    try {
      await deleteRequestById(req_id, projectId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return <Button onClick={handleGoBack}>Reject</Button>;
};

export default RejectReq;

"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { deleteRequestById } from "@/lib/actions/other.actions";

const AcceptReq = async (req_id: string) => {
  const router = useRouter();
  const handleGoBack = async () => {
    try {
      await deleteRequestById(req_id);
      // Refresh the page or redirect after deletion
      router.refresh();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return <Button onClick={handleGoBack}>Go Back</Button>;
};

export default AcceptReq;

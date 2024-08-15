"use client";
import { Button } from "@/components/ui/button";
import { sendReq } from "@/lib/actions/other.actions";
import { useToast } from "../ui/use-toast";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SendJoinReqProps = {
  projectId: string;
  senderId: string;
  senderUsername: string;
  userImage: string;
};

export default function SendJoinReq({
  projectId,
  senderId,
  senderUsername,
  userImage,
}: SendJoinReqProps) {
  const { toast } = useToast();
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const responseMessage = await sendReq({
        projectId,
        senderId,
        senderUsername,
        userImage
      });
      if (responseMessage === "Join request sent successfully") {
        toast({
          title: "Join Request Sent",
          description: "Your request has been sent successfully.",
        });
      } else if (
        responseMessage === "An error occurred while sending the join request"
      ) {
        toast({
          title: "Error",
          description: "An error occurred while sending the join request.",
          variant: "destructive",
        });
      }
      router.refresh();
      router.back();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Button type="submit">Send join request</Button>
    </form>
  );
}

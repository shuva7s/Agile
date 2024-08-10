"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back(); // Corrected function call
  };

  return <Button onClick={handleGoBack}>Go Back</Button>;
};

export default GoBack;

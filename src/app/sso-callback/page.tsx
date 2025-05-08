import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <AuthenticateWithRedirectCallback />
    </div>
  );
} 
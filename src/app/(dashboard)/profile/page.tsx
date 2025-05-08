import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/auth/ProfileForm";
import AdminRoleSetter from "@/components/AdminRoleSetter";

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProfileForm 
            initialData={{
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.emailAddresses[0]?.emailAddress || "",
              imageUrl: user.imageUrl || "/default-avatar.svg",
            }} 
          />
        </div>
        
        <div>
          {process.env.NODE_ENV === "development" && (
            <AdminRoleSetter />
          )}
        </div>
      </div>
    </div>
  );
} 
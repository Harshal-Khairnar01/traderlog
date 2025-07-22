import ProfilePage from "@/components/ProfilePage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "utils/auth";

const Profile = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div>
      <ProfilePage  />
    </div>
  );
};

export default Profile;

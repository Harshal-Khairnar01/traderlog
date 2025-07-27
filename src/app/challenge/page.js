import AppLayout from "@/components/AppLayout";
import ChallengeClientPage from "@/components/challenge/ChallengeClientPage";

import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "utils/auth";

const Challenge = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <AppLayout>
      <ChallengeClientPage/>
    </AppLayout>
  );
};

export default Challenge;

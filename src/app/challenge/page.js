
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import ChallengeClientPage from "@/components/challenge/ChallengeClientPage";
import { authOptions } from "utils/auth";

export default async function Challenge() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  return (
    <AppLayout>
      <ChallengeClientPage userId={userId} />
    </AppLayout>
  );
}

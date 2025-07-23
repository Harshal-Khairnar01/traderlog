
import { authOptions } from "utils/auth";
import { getServerSession } from "next-auth";
import DashboardPage from "@/components/DashboardPage";
import AppLayout from "@/components/AppLayout";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <AppLayout>
      <DashboardPage session={session} />
    </AppLayout>
  );
}

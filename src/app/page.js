import { authOptions } from "utils/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import DashboardPage from "@/components/DashboardPage";

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session)

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardPage session={session} />
    </>
  );
}

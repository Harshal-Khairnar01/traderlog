// app/all-trades/page.js
import { authOptions } from "utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import AllTradesClientPage from "@/components/AllTradesClientPage"; 

export default async function AllTradesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <AppLayout>
      <AllTradesClientPage />
    </AppLayout>
  );
}

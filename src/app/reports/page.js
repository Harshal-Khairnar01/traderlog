import AppLayout from "@/components/AppLayout";
import ReportClient from "@/components/ReportClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import React from "react";
import { authOptions } from "utils/auth";

const Reports = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }
  return (
     <AppLayout>
        <ReportClient/>
     </AppLayout>
  )
};

export default Reports;

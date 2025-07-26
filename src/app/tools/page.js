import AppLayout from '@/components/AppLayout';
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from 'utils/auth';

import ToolsPage from "@/components/tools/ToolsPage";

const Tools = async() => {
 const session = await getServerSession(authOptions);
   if (!session) {
     redirect("/sign-in");
   }
   return (
     <AppLayout>
       <ToolsPage />
     </AppLayout>
   );
}

export default Tools

import AppLayout from '@/components/AppLayout'
import StrategyClient from '@/components/StrategyClient';
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from 'utils/auth';

const Strategies =async () => {
      const session = await getServerSession(authOptions);
            if (!session) {
              redirect("/sign-in");
            }
  return (
   <AppLayout>
       <StrategyClient/>
    </AppLayout>
  )
}

export default Strategies

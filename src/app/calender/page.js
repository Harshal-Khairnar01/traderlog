import AppLayout from '@/components/AppLayout';
import TradeCalendar from '@/components/TradeCalender';
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from 'utils/auth';

const Calender = async() => {
      const session = await getServerSession(authOptions);
        if (!session) {
          redirect("/sign-in");
        }
  return (
    <AppLayout>
        <TradeCalendar   />
    </AppLayout>
  )
}

export default Calender

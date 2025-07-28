import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'utils/auth'
import { prisma } from 'utils/prisma'

export async function getTrade(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const { searchParams } = new URL(request.url)
    const tradeId = parseInt(searchParams.get('tradeId'))

    if (!tradeId) {
      return NextResponse.json(
        { message: 'tradeId query parameter is required' },
        { status: 400 },
      )
    }
    console.log('tradId', tradeId, 'usearid', userId)
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId: userId,
      },
    })

    if (!trade) {
      return NextResponse.json({ message: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json({ trade }, { status: 200 })
  } catch (error) {
    console.error('Error fetching trade:', error)
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 },
    )
  }
}

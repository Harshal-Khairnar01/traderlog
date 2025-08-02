import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'utils/auth'
import { prisma } from 'utils/prisma'

export async function addTrade(request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('session', session)
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const data = await request.json()

    const {
      tradeType,
      marketType,
      symbol,
      date,
      time,
      entryPrice,
      quantity,
      totalAmount,
      exitPrice,
      netPnl,
      pnlPercentage,
      direction,
      optionType,
      stopLoss,
      target,
      riskReward,
      strategyUsed,
      outcomeSummary,
      tradeAnalysis,
      tags,
      charges,
      grossPnl,
      confidenceLevel,
      emotionsBefore,
      emotionsAfter,
      notes,
      mistakes,
      mistakeChecklist,
      whatIDidWell,
      screenshotUpload,
    } = data
    const createdTrade = await prisma.trade.create({
      data: {
        tradeType,
        userId,
        marketType,
        symbol,
        date: new Date(date),
        time,
        entryPrice,
        quantity,
        totalAmount,
        exitPrice,
        netPnl,
        pnlPercentage,
        direction,
        stopLoss,
        target,
        riskReward,
        strategyUsed,
        outcomeSummary,
        tradeAnalysis,
        tags: Array.isArray(tags) ? tags : [tags],
        charges,
        grossPnl,
        psychology: {
          create: {
            confidenceLevel,
            emotionsBefore,
            emotionsAfter,
            notes,
            mistakes,
            mistakeChecklist,
            whatIDidWell,
            screenshotUrl: screenshotUpload,
            tags: Array.isArray(tags) ? tags : [tags],
          },
        },
      },
      include: {
        psychology: true,
      },
    })

    return NextResponse.json({ createdTrade }, { status: 201 })
  } catch (error) {
    console.error('Error creating trade:', error)
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 },
    )
  }
}

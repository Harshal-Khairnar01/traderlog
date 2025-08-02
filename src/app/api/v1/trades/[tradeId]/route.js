import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'utils/auth'
import { prisma } from 'utils/prisma'

export async function PUT(request, context) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tradeId } = context.params

    if (!tradeId) {
      return NextResponse.json(
        { message: 'Missing trade ID in URL' },
        { status: 400 },
      )
    }

    const userId = session.user.id

    let data
    try {
      data = await request.json()
    } catch {
      return NextResponse.json(
        { message: 'Invalid or missing JSON body' },
        { status: 400 },
      )
    }

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

    const tradeUpdateData = {
      tradeType,
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
    }

    const updatedTrade = await prisma.trade.update({
      where: {
        id: parseInt(tradeId, 10),
        userId: parseInt(userId, 10),
      },
      data: {
        ...tradeUpdateData,
        psychology: {
          update: {
            confidenceLevel,
            emotionsBefore,
            emotionsAfter,
            notes,
            mistakes,
            mistakeChecklist: Array.isArray(mistakeChecklist)
              ? mistakeChecklist
              : [],
            whatIDidWell,
            screenshotUrl: screenshotUpload || null,
            tags: Array.isArray(tags) ? tags : [tags],
          },
        },
      },
      include: {
        psychology: true,
      },
    })

  

    

    return NextResponse.json(updatedTrade, { status: 200 })
  } catch (error) {
    console.error('Error updating trade:', error)
    return NextResponse.json(
      { message: 'Error updating trade', error: error.message },
      { status: 500 },
    )
  }
}

export async function DELETE(request, context) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tradeId } = await context.params

    if (!tradeId) {
      return NextResponse.json(
        { message: 'Missing trade ID in URL' },
        { status: 400 },
      )
    }

    const userId = session.user.id

    await prisma.trade.delete({
      where: {
        id: parseInt(tradeId, 10),
        userId: parseInt(userId, 10),
      },
    })

    return NextResponse.json(
      { message: 'Trade deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error deleting trade:', error)
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 },
    )
  }
}

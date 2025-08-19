import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'utils/auth'
import { prisma } from 'utils/prisma'


export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    
    const challenge = await prisma.challenge.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
    })
    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { message: 'Failed to fetch challenge' },
      { status: 500 },
    )
  }
}


export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      targetCapital,
      challengeStartDate,
      challengeEndDate,
      challengeStartTime,
      startingCapital,
    } = body

    if (
      !targetCapital ||
      !challengeStartDate ||
      !challengeEndDate ||
      startingCapital === undefined
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      )
    }

    const existingActiveChallenge = await prisma.challenge.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
    })

    
    if (existingActiveChallenge) {
      await prisma.challenge.update({
        where: { id: existingActiveChallenge.id },
        data: { status: 'COMPLETED' },
      })
    }

   
    const newChallenge = await prisma.challenge.create({
      data: {
        userId: session.user.id,
        startingCapital: parseFloat(startingCapital),
        targetCapital: parseFloat(targetCapital),
        challengeStartDate: new Date(challengeStartDate),
        challengeEndDate: new Date(challengeEndDate),
        challengeStartTime,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({
      message: 'Challenge saved successfully',
      challenge: newChallenge,
    })
  } catch (error) {
    console.error('Error saving challenge:', error)
    return NextResponse.json(
      { message: 'Failed to save challenge' },
      { status: 500 },
    )
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const activeChallenge = await prisma.challenge.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
    })

    if (activeChallenge) {
      await prisma.challenge.delete({
        where: {
          id: activeChallenge.id,
        },
      })
      return NextResponse.json({ message: 'Challenge deleted successfully' })
    } else {
      return NextResponse.json(
        { message: 'No active challenge found to delete' },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error('Error deleting challenge:', error)
    return NextResponse.json(
      { message: 'Failed to delete challenge' },
      { status: 500 },
    )
  }
}

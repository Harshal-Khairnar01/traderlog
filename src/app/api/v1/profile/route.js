import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'utils/auth'
import { prisma } from 'utils/prisma'

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { name, initialCapital } = body

    let firstName = null
    let lastName = ''

    if (name) {
      const nameParts = name.trim().split(' ')
      if (nameParts.length > 1) {
        firstName = nameParts[0]
        lastName = nameParts.slice(1).join(' ')
      } else {
        lastName = nameParts[0]
        firstName = null
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        firstName: firstName,
        lastName: lastName,
        initialCapital: initialCapital,
      },
    })

    return NextResponse.json(
      { message: 'Profile updated successfully', user: updatedUser },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating profile:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'User not found.', error: error.message },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 },
    )
  }
}

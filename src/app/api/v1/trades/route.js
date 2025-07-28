import { NextResponse } from 'next/server'
import { addTrade } from './addTrade'

export async function POST(request) {
  return addTrade(request)
}

export async function GET(request) {
  return NextResponse.json({ tradeHistory: [] }, { status: 201 })
}

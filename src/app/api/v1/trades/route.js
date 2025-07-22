import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "utils/auth";
import { prisma } from "utils/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const tradeHistory = await prisma.trade.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ tradeHistory }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trade history:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

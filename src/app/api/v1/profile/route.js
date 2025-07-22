import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "utils/auth";
import { prisma } from "utils/prisma";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, initialCapital } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        initialCapital,
      },
    });

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

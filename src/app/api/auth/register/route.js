import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../utils/prisma";

export async function POST(request) {
  const body = await request.json();
  console.log(body);
  const { name, email, password } = body;

  if (!name.trim() || !email.trim() || !password.trim()) {
    return NextResponse.json({ message: "Fields are empty!" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        initialCapital: 0,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        message:
          error.message || "Something went wrong while registering the user",
      },
      { status: 500 }
    );
  }
}

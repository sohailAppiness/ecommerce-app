import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    // Parse the incoming JSON body to extract email and password
    const { email, password } = await req.json();

    // Step 1: Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Step 2: If user exists and the password matches, return the user object
    if (user && user.password === password) {
      return NextResponse.json(user, { status: 200 });
    }

    // Step 3: Return an error response if authentication fails
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

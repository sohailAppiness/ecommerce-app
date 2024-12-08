import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    console.log("Starting signup process...");
    const { email, password } = await request.json();
    console.log("Received data:", { email, password: "***" });

    // Validate input
    if (!email || !password) {
      console.log("Validation failed: missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists
      console.log("Checking for existing user...");
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { email: true }
      });

      if (existingUser) {
        console.log("User already exists");
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }

      // Hash the password
      console.log("Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with empty cart and saveLater
      console.log("Creating new user...");
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          cartitem: "[]",    // Initialize with empty array
          savelater: "[]"    // Initialize with empty array
        },
      });
      console.log("User created successfully");

      // Generate JWT token
      console.log("Generating JWT token...");
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log("Signup successful");
      // Return success response
      return NextResponse.json({
        id: user.id,
        email: user.email,
        token,
        cartitem: user.cartitem,
        savelater: user.savelater
      });

    } catch (dbError) {
      console.error("Database or JWT error:", dbError);
      throw dbError;
    }

  } catch (error) {
    console.error("Signup error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Return more specific error messages based on the error type
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong during signup. Please try again." },
      { status: 500 }
    );
  }
} 
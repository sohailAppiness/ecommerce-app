import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { savedItems } = await request.json();
    const userId = params.userId;

    // Update user's saved items
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        savelater: JSON.stringify(savedItems)
      }
    });

    return NextResponse.json({
      message: "Saved items updated successfully",
      savedItems: JSON.parse(updatedUser.savelater)
    });

  } catch (error) {
    console.error("Error updating saved items:", error);
    return NextResponse.json(
      { error: "Failed to update saved items" },
      { status: 500 }
    );
  }
} 
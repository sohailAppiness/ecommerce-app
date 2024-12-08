import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { cartItems } = await request.json();
    const userId = params.userId;

    // Update user's cart items
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        cartitem: JSON.stringify(cartItems)
      }
    });

    return NextResponse.json({
      message: "Cart updated successfully",
      cartItems: JSON.parse(updatedUser.cartitem)
    });

  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
} 
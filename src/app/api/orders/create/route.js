import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { amount, userId, items } = await request.json();

    // Convert amount to paise and ensure it's an integer
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise, // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Store order details in database (store original amount in rupees)
    const dbOrder = await prisma.order.create({
      data: {
        orderId: order.id,
        userId: userId,
        amount: amount, // Store original amount in rupees
        items: JSON.stringify(items),
        status: 'PENDING',
        paymentId: null,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amount,
      amountInPaise: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 
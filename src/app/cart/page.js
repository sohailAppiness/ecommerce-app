"use client";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { loadScript } from "@/lib/utils";

const CartSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
    {/* Cart Items Skeleton */}
    <div className="flex-grow space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow-md"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-md" />
          <div className="flex-grow space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>

    {/* Order Summary Skeleton */}
    <div className="lg:w-1/3">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-full mt-4" />
      </div>
    </div>
  </div>
);

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, userId } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );

      // Create order
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          userId,
          items: cartItems,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.orderId) {
        throw new Error("Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amountInPaise,
        currency: orderData.currency,
        name: "Your Store Name",
        description: "Purchase from Your Store",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.message === "Payment verified successfully") {
              setMessage("Order placed successfully!");
              clearCart();
              setTimeout(() => {
                router.push("/");
              }, 2000);
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            setMessage("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: "customer@example.com",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setMessage("Failed to initiate payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    router.replace("/signin");
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <CartSkeleton />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 mt-16">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-500 font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {message && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <img
                src={item.imageurl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-green-600 font-bold mt-2">
                  ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, (item.quantity || 1) - 1)
                    }
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-black">{item.quantity || 1}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, (item.quantity || 1) + 1)
                    }
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Order Summary
            </h2>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Total Items:</span>
              <span className="text-black">
                {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-green-600 font-bold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

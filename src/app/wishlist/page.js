"use client";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import Link from "next/link";
import { useState, useEffect } from "react";

// Skeleton component for loading state
const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <div className="w-full h-[200px] bg-gray-200" />
        </div>
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded flex-1" />
            <div className="h-10 bg-gray-200 rounded flex-1" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const savedItems = useCartStore((state) => state.savedItems);
  const removeFromSaved = useCartStore((state) => state.removeFromSaved);
  const addToCart = useCartStore((state) => state.addToCart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (!isAuthenticated) {
    router.replace("/signin");
    return null;
  }

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromSaved(productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromSaved(product.id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
        <WishlistSkeleton />
      </div>
    );
  }

  if (savedItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 mt-16">
        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-500 font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/product/${item.id}`}>
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.imageurl || "https://via.placeholder.com/400"}
                  alt={item.name}
                  className="w-full h-[200px] object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-green-600 font-bold text-xl mb-4">
                  ₹{item.price.toFixed(2)}
                </p>
              </div>
            </Link>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
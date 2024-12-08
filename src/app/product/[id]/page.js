"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import Link from "next/link";

// Skeleton component for loading state
const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 mt-[150px] animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left side - Image skeleton */}
      <div className="flex-1">
        <div className="w-full h-[400px] bg-gray-200 rounded-lg" />
      </div>

      {/* Right side - Content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-4 w-24 bg-gray-200 rounded mb-4" /> {/* Back link */}
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" /> {/* Title */}
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4" /> {/* Price */}
        <div className="space-y-2 mb-4">
          {" "}
          {/* Description */}
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
        <div className="h-32 w-full bg-gray-200 rounded mb-8" /> {/* Details */}
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <div className="h-12 w-full bg-gray-200 rounded" /> {/* Button */}
          <div className="h-12 w-full bg-gray-200 rounded" /> {/* Button */}
        </div>
        <div className="h-12 w-full bg-gray-200 rounded mt-4" />{" "}
        {/* Save button */}
      </div>
    </div>
  </div>
);

export default function ProductPage({ params }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const saveForLater = useCartStore((state) => state.saveForLater);
  const isItemSaved = useCartStore((state) => state.isItemSaved);
  const cartItems = useCartStore((state) => state.cartItems);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace("/signin");
    //   return;
    // }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    addToCart(product);
    setMessage("Added to cart successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    if (!isInCart) {
      addToCart(product);
    }
    router.push("/cart");
  };

  const handleSaveForLater = async () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    await saveForLater(product);
    setMessage(
      isItemSaved(product.id)
        ? "Product removed from saved items!"
        : "Product saved for later!"
    );
    setTimeout(() => setMessage(""), 2000);
  };

  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <div className="container mx-auto px-4 py-8 mt-[150px]">
      {message && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Image */}
        <div className="flex-1">
          <img
            src={product.imageurl}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Right side - Product Details */}
        <div className="flex-1 flex flex-col">
          <Link href="/" className="text-blue-600 hover:underline mb-4">
            ← Back to Products
          </Link>

          <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-xl text-green-400 font-bold mb-4">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-black mb-4">{product.description}</p>

          {/* Product Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-2">
              Details of the product:
            </h2>
            <p className="text-black">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia molestiae quas vel sint commodi repudiandae consequuntur
              voluptatum laborum numquam blanditiis harum quisquam eius sed odit
              fugiat iusto fuga praesentium optio, eaque rerum!
            </p>
          </div>

          {/* Buttons Container */}
          <div className="flex flex-col gap-4 mt-auto">
            {/* Buy Now and Add to Cart row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
                  isInCart
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                } text-white`}
              >
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
            {/* Save for Later button */}
            <button
              onClick={handleSaveForLater}
              className={`w-full py-3 px-6 rounded-lg transition-colors ${
                isItemSaved(product.id)
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white`}
            >
              {isItemSaved(product.id) ? "Remove from Saved" : "Save for Later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

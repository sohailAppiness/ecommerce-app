"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch product details using the product ID from the URL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-white">Product not found</div>
    );
  }

  // Handle Buy Now button
  const handleBuyNow = () => {
    alert(`Redirecting to buy ${product.name}...`);
    // Redirect to checkout or handle buy logic here
  };

  // Handle Add to Cart button
  const handleAddToCart = () => {
    alert(`${product.name} added to cart!`);
    // Implement add-to-cart logic here
  };

  // Handle Save for Later button
  const handleSaveForLater = () => {
    alert(`${product.name} saved for later!`);
    // Implement save-for-later logic here
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-700">
      <div className="bg-slate-800 shadow-md rounded-lg p-8 mt-10 max-w-3xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
        <p className="text-white text-lg mb-4">{product.description}</p>
        <p className="text-2xl font-semibold text-white mb-6">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleBuyNow}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Add to Cart
          </button>
          <button
            onClick={handleSaveForLater}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Save for Later
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";

// Skeleton component for loading state
const ProductSkeleton = () => (
  <div className="group relative w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] overflow-hidden rounded-xl bg-white shadow-lg animate-pulse">
    <div className="aspect-[4/3] overflow-hidden bg-gray-200" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-6 w-2/3 bg-gray-300 rounded mb-2" />
        <div className="flex justify-between items-center">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-4 w-1/4 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {loading ? (
          // Show 8 skeleton items while loading
          [...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : (
          products.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="group relative w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.imageurl || "https://via.placeholder.com/400x300"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {product.name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80 text-sm">
                      View Details
                    </p>
                    <p className="text-green-400 font-bold">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
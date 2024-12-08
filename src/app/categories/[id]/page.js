"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Skeleton component for loading state
const ProductSkeleton = () => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg overflow-hidden w-[300px] animate-pulse">
    <div className="w-full h-[200px] bg-gray-700 rounded" />
    <div className="p-4">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-700 rounded w-full mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default function CategoryProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?categoryId=${id}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [id]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-6 mt-[100px]">
      {loading ? (
        // Show 8 skeleton items while loading
        [...Array(8)].map((_, index) => <ProductSkeleton key={index} />)
      ) : products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-lg overflow-hidden w-[300px] hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/product/${product.id}`}>
              <div className="w-full h-[200px] overflow-hidden">
                <img
                  src={product.imageurl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black mb-2">
                  {product.name}
                </h3>
                <p className="text-black text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <ProductSkeleton />
      )}
    </div>
  );
}

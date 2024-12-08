"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";

// Skeleton component for loading state
const CategorySkeleton = () => (
  <div className="group relative w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] overflow-hidden rounded-xl bg-white shadow-lg animate-pulse">
    <div className="aspect-[4/3] overflow-hidden bg-gray-200" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-6 w-1/2 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-300 rounded" />
      </div>
    </div>
  </div>
);

export default function CategoriesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }

    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/categories`
          : '/api/categories';

        const response = await fetch(apiUrl);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Placeholder images for categories
  const categoryImages = {
    Electronics:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
    Fashion:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
    "Home & Kitchen":
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500",
    Books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
    "Sports & Outdoors":
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500",
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[150px]">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop by Category</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {loading ? (
          // Show 6 skeleton items while loading
          [...Array(6)].map((_, index) => (
            <CategorySkeleton key={index} />
          ))
        ) : (
          categories.map((category) => (
            <Link
              href={`/categories/${category.id}`}
              key={category.id}
              className="group relative w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={
                    categoryImages[category.name] ||
                    "https://via.placeholder.com/400x300"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">Explore {category.name}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

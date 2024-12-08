"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const savedItems = useCartStore((state) => state.savedItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const handleAuthClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      localStorage.clear();
      logout();
      window.location.href = "/signin";
    } else {
      router.push("/signin");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            eCommerce
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                isActive("/")
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`text-sm transition-colors ${
                isActive("/categories")
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                isActive("/about")
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className="h-5 w-5 text-gray-600" />
              {savedItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {savedItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={handleAuthClick}
              className="text-sm bg-slate-200 p-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium"
            >
              {isAuthenticated ? "Sign Out" : "Sign In"}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  isActive("/")
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  isActive("/categories")
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  isActive("/about")
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

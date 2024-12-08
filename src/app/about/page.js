"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import {
  FaShoppingCart,
  FaUserShield,
  FaTruck,
  FaHeadset,
} from "react-icons/fa";

export default function AboutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const features = [
    {
      icon: <FaShoppingCart className="w-12 h-12 text-blue-500" />,
      title: "Easy Shopping",
      description:
        "Browse through our extensive collection of products and shop with ease using our intuitive interface.",
    },
    {
      icon: <FaUserShield className="w-12 h-12 text-blue-500" />,
      title: "Secure Payments",
      description:
        "Your transactions are protected with state-of-the-art security measures and encryption.",
    },
    {
      icon: <FaTruck className="w-12 h-12 text-blue-500" />,
      title: "Fast Delivery",
      description:
        "Get your orders delivered quickly and efficiently to your doorstep with our reliable shipping partners.",
    },
    {
      icon: <FaHeadset className="w-12 h-12 text-blue-500" />,
      title: "24/7 Support",
      description:
        "Our dedicated customer support team is always ready to help you with any queries or concerns.",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-black mb-6">
          Welcome to Our E-Commerce Store
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your one-stop destination for all your shopping needs. We provide
          high-quality products with exceptional customer service.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-black mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a vision to revolutionize online shopping, we've
              grown from a small startup to a trusted e-commerce platform. Our
              journey has been driven by our commitment to customer satisfaction
              and quality service.
            </p>
            <p className="text-gray-600 mb-4">
              We take pride in offering a carefully curated selection of
              products that meet our high standards of quality. Our team works
              tirelessly to ensure that every customer has a seamless shopping
              experience.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-blue-500">10K+</h4>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-bold text-blue-500">5K+</h4>
                <p className="text-gray-600">Products</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white flex items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="mb-4">
                To provide our customers with the best online shopping
                experience through:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>High-quality products at competitive prices</li>
                <li>Exceptional customer service</li>
                <li>Fast and reliable delivery</li>
                <li>Secure and convenient shopping</li>
                <li>Continuous innovation and improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Get in Touch</h2>
        <p className="text-xl text-gray-600 mb-8">
          Have questions? We're here to help!
        </p>
        <div className="inline-flex space-x-4">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Contact Us
          </button>
          <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
            FAQs
          </button>
        </div>
      </div>
    </div>
  );
}

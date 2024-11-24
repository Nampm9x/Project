import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Product() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/product/get-products-for-user");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-gray-800 rounded-lg shadow-lg p-4 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center">
                <img
                  src={product.thumbnail}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  alt={product.name}
                />
                <h5 className="text-lg font-semibold text-white mb-2">
                  {product.name}
                </h5>
                <p className="text-red-500 text-lg font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

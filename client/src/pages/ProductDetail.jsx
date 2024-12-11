import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Rate from "../components/rate/Rate";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [currentShow, setCurrentShow] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { currentUser } = useSelector((state) => state.user);
  const [rates, setRates] = useState([]);

  const router = useNavigate();

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlus = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleChangeShow = (image) => {
    setCurrentShow(image);
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`/api/rate/get-rates/${id}`);
        const data = await res.json();
        setRates(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRates();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/get-product-by-id/${id}`);
        const data = await res.json();
        setProduct(data);
        setCurrentShow(data.thumbnail);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please login to add to cart");
      localStorage.setItem("redirect-cart", `/product/${id}`);
      router("/login");
      return;
    }
    try {
      const res = await fetch("/api/cart/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          productId: product._id,
          quantity,
          price: product.price * quantity,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Thêm vào giỏ thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      alert("Đăng nhập để mua");
      localStorage.setItem("redirect-cart", `/product/${id}`);
      router("/login");
      return;
    }
    localStorage.setItem(
      "cartToCheckout",
      JSON.stringify([
        {
          price: product.price * quantity,
          quantity,
          productId: product._id,
          _id: product._id,
        },
      ])
    );

    router("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {product && (
        <div className="container mx-auto max-w-4xl p-6 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <img
              className="w-full h-[300px] object-contain rounded-lg"
              src={currentShow}
              alt={product.name}
            />
            <div className="flex gap-4 mt-4 justify-center">
              <img
                onClick={() => handleChangeShow(product.thumbnail)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  currentShow === product.thumbnail
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                src={product.thumbnail}
                alt="Thumbnail"
              />
              {product.images.map((image, index) => (
                <img
                  key={index}
                  onClick={() => handleChangeShow(image)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    currentShow === image
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  src={image}
                  alt={`Image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl text-red-500 font-semibold mb-2">
              Giá:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
            <p className="text-gray-600">
              Số lượng trong kho: {product.quantity}
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={handleMinus}
              className="w-10 h-10 bg-gray-200 text-lg font-bold rounded-full shadow-md hover:bg-gray-300"
            >
              -
            </button>
            <div className="text-xl font-semibold">{quantity}</div>
            <button
              onClick={handlePlus}
              className="w-10 h-10 bg-gray-200 text-lg font-bold rounded-full shadow-md hover:bg-gray-300"
            >
              +
            </button>
          </div>

          <div className="text-center text-lg font-medium mb-6">
            <p>
              Ước tính tổng:{" "}
              <span className="text-red-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price * quantity)}
              </span>
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Mua ngay
            </button>
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          {rates && rates.length > 0 && (
            <div>
              <h2>Đánh giá sản phẩm</h2>
              {rates.map((rate, index) => (
                <div key={index}>
                  <Rate rate={rate} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

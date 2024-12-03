import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CartDetail from "./../components/cart/CartDetail";
import { Link } from "react-router-dom";

export default function Cart() {
  const { currentUser } = useSelector((state) => state.user);
  const [cart, setCart] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [cartToCheckout, setCartToCheckout] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart/get-cart/${currentUser._id}`);
        const data = await res.json();
        setCart(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, [currentUser, isUpdated]);

  useEffect(() => {
    localStorage.setItem("cartToCheckout", JSON.stringify(cartToCheckout));
  }, [cartToCheckout]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cart</h1>
      
      {cart && cart.products.length > 0 ? (
        <div className="space-y-4">
          {cart.products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                name="cart"
                value={product.productId}
                checked={cartToCheckout.some(
                  (item) => item.productId === product.productId
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCartToCheckout([...cartToCheckout, product]);
                  } else {
                    setCartToCheckout(
                      cartToCheckout.filter(
                        (item) => item.productId !== product.productId
                      )
                    );
                  }
                }}
                className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-300 rounded border-gray-300"
              />
              <div className="flex-grow">
                <CartDetail
                  product={product}
                  setIsUpdated={setIsUpdated}
                  isUpdated={isUpdated}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8">Giỏ hàng trống</p>
      )}
      
      {cartToCheckout.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Link to="/checkout">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Đặt hàng 
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}  
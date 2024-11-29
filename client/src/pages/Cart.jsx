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
    <div>
      <h1>Cart</h1>
      {cart &&
        cart.products.map((product) => (
          <div key={product.productId} className="flex">
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
            />
            <CartDetail
              product={product}
              setIsUpdated={setIsUpdated}
              isUpdated={isUpdated}
            />
          </div>
        ))}
      {cartToCheckout.length > 0 && (
        <Link to="/checkout">
          <button>Checkout</button>
        </Link>
      )}
    </div>
  );
}

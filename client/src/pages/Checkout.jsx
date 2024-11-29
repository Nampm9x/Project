import React, { useState } from "react";
import ProductDetailForCheckout from "./ProductDetailForCheckout";
import { useSelector } from "react-redux";

export default function Checkout() {
  const cartToCheckout = localStorage.getItem("cartToCheckout");
  const [fromData, setFormData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
    let total = 0;
    for(let i = 0; i < JSON.parse(cartToCheckout).length; i++){
        total += JSON.parse(cartToCheckout)[i].price;
    }

    console.log(total);

  const handleChange = (e) => {
    setFormData({ ...fromData, [e.target.name]: e.target.value });
  };

  console.log(cartToCheckout);

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/order/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: currentUser._id,
          name: fromData.fullName,
          phone: fromData.phone,
          address: fromData.address,
          products: JSON.parse(cartToCheckout),
          total
        }),
      });
      const data = await res.json();
      if(res.ok){
        alert("Order created");
        localStorage.removeItem("cartToCheckout");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      {cartToCheckout ? (
        JSON.parse(cartToCheckout).map((item, index) => {
          return (
            <div key={index}>
              <ProductDetailForCheckout item={item} />
            </div>
          );
        })
      ) : (
        <p>Cart is empty</p>
      )}
      <form onSubmit={handleCheckout}>
        <div className="">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Full name"
            className="border"
            name="fullName"
          />
        </div>
        <div className="">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Phone number"
            className="border"
            name="phone"
          />
        </div>
        <div className="">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Address"
            className="border"
            name="address"
          />
        </div>
        <div className="">
          <button type="submit" className="border">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
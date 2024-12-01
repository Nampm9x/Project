import React, { useState } from "react";
import ProductDetailForCheckout from "./ProductDetailForCheckout";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const cartToCheckout = localStorage.getItem("cartToCheckout");
  const [fromData, setFormData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
    let total = 0;
    for(let i = 0; i < JSON.parse(cartToCheckout).length; i++){
        total += JSON.parse(cartToCheckout)[i].price;
    }

    const navigate=useNavigate()

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
        alert("Đặt hàng thành công");
        localStorage.removeItem("cartToCheckout");
        navigate(`/order/${data._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {cartToCheckout && JSON.parse(cartToCheckout).length > 0 ? (
        <div className="space-y-4 mb-6">
          {JSON.parse(cartToCheckout).map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md flex items-center"
            >
              <ProductDetailForCheckout item={item} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8">Giỏ hàng trống</p>
      )}
  
      <form
        onSubmit={handleCheckout}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Họ và tên</label>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Enter your full name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="fullName"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Số điện thoại</label>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="phone"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Địa chỉ</label>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Enter your address"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="address"
            required
          />
        </div>
  
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Đặt hàng
          </button>
        </div>
      </form>
    </div>
  );
}  
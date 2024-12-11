import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function AdminOrder({ order, index }) {
  const formattedDate = moment(order.createdAt).format("DD/MM/YYYY");
  const [status, setStatus] = useState(order.status);
  const [product,setProduct]=useState(null)

  console.log("order",order)
  console.log("index",index)

  const handleUpdateStatus = async () => {
    try {
      const res = await fetch(`/api/order/update-status/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Đang giao" }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.status);
        alert("Đơn hàng đã xử lí");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    const fetchProduct=async ()=>{
        try {
            const res=await fetch(`/api/product/get-product-by-id/${order.products[0].productId}`)
            const data=await res.json();
            setProduct(data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchProduct()
  },[order])
  return (
    <> 
      <td className="border border-gray-300 px-4 py-2 text-left">
        {index + 1}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left">
        <img className="w-12 aspect-square object-cover" src={product?.thumbnail} alt="" />
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left">
        {product?.name}
      </td>
      <td className="border border-gray-300 px-4 py-2">{order.receiver}</td>
      <td className="border border-gray-300 px-4 py-2">{order.address}</td>
      <td className="border border-gray-300 px-4 py-2">{formattedDate}</td>
      <td className="border border-gray-300 px-4 py-2 font-semibold text-red-500">
        {order.total}₫
      </td>

      <td className="border border-gray-300 px-4 py-2">
        <span>{status}</span>
        {status === "Chờ xử lý" && (
          <button onClick={handleUpdateStatus} className="border px-3 py-1">
            <FaRegCircleCheck />
          </button>
        )}
      </td>
    </>
  );
}

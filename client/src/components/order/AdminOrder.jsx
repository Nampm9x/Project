import React, { useState } from "react";
import moment from "moment";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function AdminOrder({ order, index }) {
  const formattedDate = moment(order.createdAt).format("DD/MM/YYYY");
  const [status, setStatus] = useState(order.status);

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
        alert("Đơn hàng đã xử lí")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="border p-2 my-2 flex gap-5">
      <p>{index + 1}</p>
      <p>{order.receiver}</p>
      <p>{order.address}</p>
      <p>{formattedDate}</p>
      <p>{order.total}</p>

      <div className="flex gap-3">
        <p>{status}</p>
        {status === "Chờ xử lý" && (
          <button onClick={handleUpdateStatus} className="border px-3 py-1">
            <FaRegCircleCheck />
          </button>
        )}
      </div>
    </div>
  );
}
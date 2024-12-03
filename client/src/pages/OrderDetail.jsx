import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderProduct from "../components/order/OrderProduct";

export default function OrderDetail() {
  const [order, setOrder] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/get-order/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(`/api/order/cancel-order/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      setOrder(data);
      alert("Hủy đơn hàng thành công");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {order && (
        <div>
          <h1>Thông tin đơn hàng</h1>
          <p>Người đặt hàng: {order.receiver}</p>
          <p>Số điện thoại: {order.phone}</p>
          <p>Địa chỉ: {order.address}</p>
          <p>Sản phẩm: </p>
          {order.products.map((product, index) => (
              <div key={index}>
              <OrderProduct item={product} />
            </div>
          ))}
          <p>Số lượng: {order.total}</p>
          <p>Trạng thái: {order.status}</p>
          {
            order.status === "Chờ xử lý" && (
              <button onClick={handleCancelOrder} className="bg-red-400 border py-2 px-3">Hủy đơn hàng</button>
            )
          }
        </div>
      )}
    </div>
  );
}
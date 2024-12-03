import React, { useEffect, useState } from "react";
import AdminOrder from "../../components/order/AdminOrder";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const pendingOrders = orders.filter(
    (order) => order.status === "Chờ xử lý"
  ).length;
  const shippingOrders = orders.filter(
    (order) => order.status === "Đang giao"
  ).length;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order/get-orders-for-admin");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div>Đơn hàng chờ xử lý: {pendingOrders}</div>
      <div>Đơn hàng đang giao: {shippingOrders}</div>
      <div className="flex gap-5">
        <div>STT</div>
        <div>Tên khách hàng</div>
        <div>Địa chỉ</div>
        <div>Ngày đặt hàng</div>
        <div>Tổng tiền</div>
        <div>Trạng thái</div>
      </div>
      {orders.map((order, index) => (
        <div key={index}>
          <AdminOrder order={order} index={index} />
        </div>
      ))}
    </div>
  );
}
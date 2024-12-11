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
    <div className="p-4 space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-md text-center">
          <p className="text-lg font-bold text-blue-700">Đơn hàng chờ xử lý</p>
          <p className="text-xl font-semibold">{pendingOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md text-center">
          <p className="text-lg font-bold text-green-700">Đơn hàng đang giao</p>
          <p className="text-xl font-semibold">{shippingOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          {/* Table Header */}
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                STT
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Ảnh
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Sản phẩm
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Tên khách hàng
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Địa chỉ
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Ngày đặt hàng
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Tổng tiền
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Trạng thái
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <AdminOrder order={order} index={index} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

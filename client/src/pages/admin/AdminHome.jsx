import React, { useEffect, useState } from 'react'

export default function AdminHome() {
  const [productsSold, setProductsSold] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [successOrders, setSuccessOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch("/api/order/get-revenue");
        const data = await res.json();
        setRevenue(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRevenue();
  }, [])

  useEffect(() => {
    const fetchSuccessOrders = async () => {
      try {
        const res = await fetch("/api/order/get-success-orders");
        const data = await res.json();
        setSuccessOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuccessOrders();
  }, [])

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await fetch("/api/order/get-pending-orders");
        const data = await res.json();
        setPendingOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPendingOrders();
  }, []);

  useEffect(() => {
    const fetchProductsSold = async () => {
      try {
        const res = await fetch("/api/product/get-products-sold");
        const data = await res.json();
        setProductsSold(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductsSold();
  }, [])

  return (
    <div>
        <h2>Admin Home</h2>
        <div className="">
            So luong san pham da ban: {productsSold}
        </div>
        <div className="">
            Don hang cho xu ly: {pendingOrders}
        </div>
        <div className="">
            Don hang da thanh cong: {successOrders}
        </div>
        <div className="">
            Doanh thu: {revenue} dong
        </div>
    </div>
  )
}
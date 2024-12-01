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
  
  return (
    <div>
      {order && (
        <div>
          <h1>Order Detail</h1>
          <p>Receiver: {order.receiver}</p>
          <p>Phone: {order.phone}</p>
          <p>Address: {order.address}</p>
          <p>Products: </p>
          {order.products.map((product, index) => (
              <div key={index}>
              <OrderProduct item={product} />
            </div>
          ))}
          <p>Total: {order.total}</p>
        </div>
      )}
    </div>
  );
}
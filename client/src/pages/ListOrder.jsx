import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Order from '../components/order/Order';
import { Link } from 'react-router-dom';

export default function ListOrder() {
    const [orders, setOrders] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/order/get-orders/${currentUser._id}`);
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchOrders();
    }, [currentUser._id]);
  return (
    <div>
        {
            orders.map((order, index) => (
                <Link to={`/order/${order._id}`} key={index} className='flex gap-5'>
                    <p>{index +1}</p>
                    <Order order={order} />
                </Link>
            ))
        }
    </div>
  )
}
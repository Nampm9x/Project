import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CartDetail from './../components/cart/CartDetail';

export default function Cart() {
    const { currentUser } = useSelector((state) => state.user);
    const [cart, setCart] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch(`/api/cart/get-cart/${currentUser._id}`);
                const data = await res.json();
                setCart(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCart();
    }, [currentUser,isUpdated]);
  return (
    <div>
        <h1>Cart</h1>
        {cart && cart.products.map((product) => (
            <div key={product.productId}>
                <CartDetail
                product={product}
                setIsUpdated={setIsUpdated}
                isUpdated={isUpdated}
                />
            </div>
        ))}
    </div>
  )
}

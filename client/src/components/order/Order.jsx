import React, { useEffect, useState } from 'react'

export default function Order({ order }) {
    const [product, setProduct] = useState(null);

    useEffect (() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/product/get-product-by-id/${order.products[0].productId}`);
            const data = await res.json();
            setProduct(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchProduct();
    }, [order.products]);
  return (
    <div className='flex gap-5'>
        <img src={product?.thumbnail} alt={product?.name} className='w-20 aspect-square' />
        <p>{product?.name}</p>
        <p>{order.products[0].quantity}</p>
        <p>{order.total}</p>
    </div>
  )
}
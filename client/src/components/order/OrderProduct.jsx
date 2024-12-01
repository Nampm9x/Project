import React, { useEffect, useState } from "react";

export default function OrderProduct({ item }) {
  const [product, setProduct] = useState(null);

  console.log(item);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/product/get-product-by-id/${item.productId}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [item.productId]);
  return (
    <div>
      {product && (
        <div className="flex gap-5">
          <img src={product.thumbnail} alt={product.name} className="w-20 aspect-square" />
          <p>Name: {product.name}</p>
          <p>Price: {product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Thành tiền: {item.quantity * product.price}</p>
        </div>
      )}
    </div>
  );
}
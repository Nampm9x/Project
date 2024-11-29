import React, { useEffect, useState } from "react";

export default function ProductDetailForCheckout({ item }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/get-product-by-id/${item.productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [item]);

  console.log(item);
  return (
    <div className="flex items-center gap-10">
      <img src={product?.thumbnail} alt="" className="w-20 h-20" />
        <p>{product?.name}</p>
        <p>{item.quantity}</p>
        <p>{item.price}</p>
    </div>
  );
}
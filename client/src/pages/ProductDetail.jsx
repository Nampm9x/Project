import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [currentShow, setCurrentShow] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlus = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleChangeShow = (image) => {
    setCurrentShow(image);
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/get-product-by-id/${id}`);
        const data = await res.json();
        setProduct(data);
        setCurrentShow(data.images[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {product && (
        <>
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <img
              className="w-full h-64 object-cover"
              src={currentShow}
              alt={product.name}
            />
            <div className="flex gap-4">
              {product.images.length > 0 &&
                product.images.map((image, index) => (
                  <img
                    key={index}
                    onClick={() => handleChangeShow(image)}
                    className="w-[100px] h-[100px] object-cover hover:cursor-pointer"
                    src={image}
                    alt={product.name}
                  />
                ))}
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">
                tên sản phẩm: {product.name}
              </h1>
              <p className="text-xl text-gray-700 mb-4">
                {" "}
                giá: ${product.price}
              </p>
              <p className="text-gray-600">số lượng: {product.quantity}</p>
            </div>
            <div className="flex">
              <button onClick={handleMinus}>-</button>
              <div>{quantity}</div>
              <button onClick={handlePlus}>+</button>
            </div>
            <div>
                Ước tính: ${product.price * quantity}
            </div>
            <div className="flex gap-5">
              <button className="px-3 py-1 border bg-blue-400">Buy now</button>
              <button className="px-3 py-1 border bg-blue-400">
                Add to cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}   
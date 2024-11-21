import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Product() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/product/get-products-for-user");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div>
      <div>
        <h1>Products</h1>
        <div className="row flex flex-wrap px-5">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="col-4 border p-3 w-1/4 aspect-square"
            >
              <div className="card">
                <img
                  src={product.thumbnail}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

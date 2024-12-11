import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [comment, setComment] = useState("");
  const [rates, setRates] = useState([]);
  const [isRated, setIsRated] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  useEffect(() => {
    if (order && order.products.length > 0) {
      const fetchRates = async () => {
        setIsLoadingRates(true);
        try {
          const res = await fetch(
            `/api/rate/get-rates/${order.products[0].productId}`
          );
          const data = await res.json();
          setRates(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingRates(false);
        }
      };
      fetchRates();
    }
  }, [order, rates]);

  useEffect(() => {
    if (!isLoadingRates && rates.length > 0 && order) {
      const rated = rates.find((rate) => rate.owner._id === order.user);
      setIsRated(Boolean(rated));
    }
  }, [order, rates, isLoadingRates]);

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/rate/create-rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          products: order.products.map((product) => product.productId),
          owner: order.user,
        }),
      });
      const data = await res.json();
      alert("Đánh giá sản phẩm thành công");
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(`/api/order/cancel-order/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      setOrder(data);
      alert("Hủy đơn hàng thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const [productsDetails, setProductsDetails] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRequests = order.products.map((product) =>
          fetch(`/api/product/get-product-by-id/${product.productId}`)
        );
        const productResponses = await Promise.all(productRequests);
        const productData = await Promise.all(
          productResponses.map((res) => res.json())
        );
        setProductsDetails(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (order?.products) {
      fetchProducts();
    }
  }, [order]);

  const handleUpdateStatus = async () => {
    try {
      const res = await fetch(`/api/order/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Đã giao" }),
      });
      const data = await res.json();
      setOrder(data);
      alert("Nhận hàng thành công");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      {order && (
        <div>
          <h1 className="text-xl font-bold mb-4">Thông tin đơn hàng</h1>
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-semibold">Người đặt hàng:</span>{" "}
              {order.receiver}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {order.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Địa chỉ:</span> {order.address}
            </p>
          </div>

          <h2 className="font-semibold text-lg mb-2">Sản phẩm</h2>
          <div className="space-y-4 mb-4">
            {productsDetails.length > 0 &&
              order.products.map((item, index) => {
                const product = productsDetails.find(
                  (p) => p._id === item.productId
                );
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b pb-2"
                  >
                    {product ? (
                      <>
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-gray-600">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p>Đang tải sản phẩm...</p>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="text-gray-600 mb-4">
            <p>
              <span className="font-semibold">Tổng số lượng:</span>{" "}
              {order.total}
            </p>
            <p>
              <span className="font-semibold">Trạng thái:</span> {order.status}
            </p>
          </div>

          {order.status === "Đang giao" && (
            <button onClick={handleUpdateStatus} className="border px-3 py-1">
              Đã nhận được hàng
            </button>
          )}

          {order.status === "Chờ xử lý" && (
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                  handleCancelOrder();
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Hủy đơn hàng
            </button>
          )}
          {order.status === "Đã giao" && !isRated && (
            <form onSubmit={handleSubmitComment}>
              <label htmlFor="comment">Comment</label>
              <input
                onChange={handleChangeComment}
                type="text"
                id="comment"
                className="border"
              />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

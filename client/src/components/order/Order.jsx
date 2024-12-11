import React, { useEffect, useState } from 'react';

export default function Order({ order }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Lưu trữ lỗi nếu có

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await Promise.all(
          order.products.map(async (item) => {
            const res = await fetch(`/api/product/get-product-by-id/${item.productId}`);
            if (!res.ok) throw new Error('Failed to fetch product');
            return await res.json();
          })
        );
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [order.products]);

  return (
    <div className="border-b pb-4 mb-4">
      <h3 className="font-bold text-lg">Đơn hàng</h3>
      {loading ? (
        <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => {
            const quantity = order.products.find((item) => item.productId === product._id)?.quantity;
            return (
              <div key={index} className="flex items-center gap-5">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-gray-600">Số lượng: {quantity}</p>
                  <p className="text-gray-600">Trạng thái: {order.status}</p>
                </div>
              </div>
            );
          })}
          <p className="font-bold text-lg">Tổng tiền: {order.total}₫</p>
        </div>
      )}
    </div>
  );
}

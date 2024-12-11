import React,{useEffect,useState} from 'react'

export default function Home() {
  const [productsFeatured, setProductsFeatured] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/get-products-featured");
        const data = await res.json();
        setProductsFeatured(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div>
      <div>
        <img className='w-full' src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0e76fb25-d8c8-48ac-baeb-acb0003aa5f1/dentqzg-38c47608-50e7-4868-b8dc-9bff58189ad0.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzBlNzZmYjI1LWQ4YzgtNDhhYy1iYWViLWFjYjAwMDNhYTVmMVwvZGVudHF6Zy0zOGM0NzYwOC01MGU3LTQ4NjgtYjhkYy05YmZmNTgxODlhZDAuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.LsveFI2WChd3uGlxQREjFQp0ZgUFKggruSFJm9LmjUY" alt="" />
      </div>
      <div className="p-6">
  <h1 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h1>
  {productsFeatured && productsFeatured.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productsFeatured.map((product, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
        >
          {/* Product Image */}
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name || "Product Image"}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md mb-3">
              <p className="text-gray-500">No Image</p>
            </div>
          )}
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {product.name || "Unnamed Product"}
          </h3>
          {/* Product Price */}
          <p className="text-red-500 font-bold text-lg">
            {product.price ? `${product.price}₫` : "Liên hệ"}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">Không có sản phẩm nổi bật.</p>
  )}
</div>

    </div>
  )
}

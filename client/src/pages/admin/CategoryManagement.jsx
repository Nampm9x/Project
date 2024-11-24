import React, { useEffect, useState } from "react";
import Category from "../../components/category/Category";

export default function CategoryManagement() {
  const [newCategory, setNewCategory] = useState({ name: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/category/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await res.json();

      if (res.status === 201) {
        setNewCategory({ name: "", category: "" });
        setIsUpdate(!isUpdate);
        alert("Thêm danh mục thành công!");
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/get-categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [isUpdate]);

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-10">
      <div className="flex justify-between">
        {/* Form thêm danh mục */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Tên danh mục
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Danh mục cha
              </label>
              <select
                id="category"
                name="category"
                value={newCategory.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Không có</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Thêm danh mục
            </button>
          </form>
        </div>

        {/* Danh sách danh mục */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Danh sách danh mục</h3>
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="py-3 px-4 border-b w-1/3 text-center">Tên danh mục</th>
                <th className="py-3 px-4 border-b w-1/3 text-center">Số lượng sản phẩm</th>
                <th className="py-3 px-4 border-b w-1/3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Category
                    key={category._id}
                    category={category}
                    setCategories={setCategories}
                    categories={categories}
                    isUpdate={isUpdate}
                    setIsUpdate={setIsUpdate}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    Không có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

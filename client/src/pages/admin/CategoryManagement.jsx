import React, { useEffect, useState } from "react";
import Category from "../../components/category/Category";

export default function CategoryManagement() {
  const [newCategory, setNewCategory] = useState({});
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
        if(data.parentCategory) {
          setIsUpdate(!isUpdate);
        } else{
          setCategories([...categories, data]);
        }
        alert("Thêm danh mục thành công");
      } else {
        setNewCategory({ name: "", category: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/get-categories"); // lay danh muc
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [isUpdate]);

  return (
    <div className="px-8">
      <h2 className="py-10 bg-gray-300">Quản lý danh mục</h2>
      <div className="flex justify-between">
        <div className="w-1/5">
          <h3 className="text-xl font-semibold">Thêm danh mục</h3>
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <label htmlFor="name">Tên danh mục</label>
              <input
                onChange={handleChange}
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                required
                className="border-2 w-full"
              />
            </div>
            <div className="py-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-2 py-1"
              >
                Thêm danh mục
              </button>
              <label htmlFor="category">Chọn danh mục cha</label>
              <select onChange={handleChange} name="category" id="category">
                <option value="">Không có</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
        <div className="w-4/5">
          <h3 className="text-xl font-semibold">Danh sách danh mục</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Số lượng sản phẩm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <Category
                  key={index}
                  category={category}
                  setCategories={setCategories}
                  categories={categories}
                  isUpdate={isUpdate}
                  setIsUpdate={setIsUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

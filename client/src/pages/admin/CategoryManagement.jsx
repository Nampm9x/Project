import React, { useEffect, useState } from "react";
import Category from "../../components/category/Category";

export default function CategoryManagement() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/category/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setCategoryName("");
        setCategories([...categories,data]);
      } else {
        alert(data.message);
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
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  console.log(categories);

  return (
    <div className="px-8">
      <h2 className="py-10 bg-gray-300">Quản lý sản phẩm</h2>
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
                value={categoryName}
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
            {categories.map((category) => (
                <div key={category._id}> 
                <Category category={category}
                setCategories={setCategories}/>
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
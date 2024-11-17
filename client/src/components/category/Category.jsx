import React, { useEffect, useState } from "react";

export default function Category({
  category,
  setCategories,
  categories,
  isUpdate,
  setIsUpdate,
}) {
  const [childrenCategories, setChildrenCategories] = useState([]);
  const [isShowChildrenCategories, setIsShowChildrenCategories] =
    useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleShowChildrenCategories = () => {
    setIsShowChildrenCategories(!isShowChildrenCategories);
  };

  const handleChangeEditCategory = () => {
    setIsEditCategory(!isEditCategory);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/category/delete-category/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.status === 200) {
        setCategories((prev) => prev.filter((category) => category._id !== id));
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchChildrenCategories = async () => {
      try {
        const res = await fetch(
          `/api/category/get-child-categories/${category._id}`
        );
        const data = await res.json();
        setChildrenCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChildrenCategories();
  }, [categories]);

  const handleEditCategory = async () => {
    try {
      const res = await fetch(`/api/category/edit-category/${category._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });
      const data = await res.json();
      setCategoryName(data.name);
      setIsEditCategory(false);
      alert("Sửa danh mục thành công");
      setIsUpdate(!isUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr>
      <td onClick={handleShowChildrenCategories}>
        {isEditCategory ? (
          <>
            <input
              className="border"
              onChange={handleChange}
              type="text"
              value={categoryName}
            />
            <button
              onClick={handleEditCategory}
              type="button"
              className="bg-red-500 text-white px-2 py-1"
            >
              Lưu
            </button>
          </>
        ) : (
          <>
            {categoryName}
            {isShowChildrenCategories && (
              <ul className="pl-3 text-blue-500">
                {childrenCategories.map((childrenCategory) => (
                  <li key={childrenCategory._id}>{childrenCategory.name}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </td>
      <td>{category.quantity}</td>
      <td>
        <button
          type="button"
          onClick={() => handleDelete(category._id)}
          className="bg-red-500 text-white px-2 py-1"
        >
          Xóa
        </button>
      </td>
      <td>
        <button
          type="button"
          onClick={handleChangeEditCategory}
          className="bg-red-500 text-white px-2 py-1"
        >
          Sửa
        </button>
      </td>
    </tr>
  );
}

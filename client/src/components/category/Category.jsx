import React, { useEffect, useState } from "react";
import ChildCategory from "./ChildCategory";

export default function Category({
  category,
  setCategories,
  categories,
  isUpdate,
  setIsUpdate,
}) {
  const [childCategories, setChildCategories] = useState([]);
  const [isShowChildCategories, setIsShowChildCategories] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const [isEditChildCategory, setIsEditChildCategory] = useState(false);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleShowChildCategories = () => {
    setIsShowChildCategories(!isShowChildCategories);
  };

  const handleChangeEditCategory = () => {
    setIsEditCategory(!isEditCategory);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này không?")) {
      try {
        const res = await fetch(`/api/category/delete-category/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.status === 200) {
          setCategories((prev) =>
            prev.filter((category) => category._id !== id)
          );
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchChildCategories = async () => {
      try {
        const res = await fetch(
          `/api/category/get-child-categories/${category._id}`
        );
        const data = await res.json();
        setChildCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChildCategories();
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
      <td>
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
              className="bg-green-500 text-white px-2 py-1"
            >
              Lưu
            </button>
          </>
        ) : (
          <>
            <p onClick={handleShowChildCategories}>{categoryName}</p>
            {isShowChildCategories && (
              <ul className="pl-3 text-blue-500">
                {childCategories.map((childCategory,index) => (                 
                    <ChildCategory
                      key={index}
                      setChildCategories={setChildCategories}
                      childCategory={childCategory}
                      isUpdate={isUpdate}
                      setIsUpdate={setIsUpdate}
                    />                  
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
          onClick={handleChangeEditCategory}
          className="bg-blue-500 text-white px-2 py-1"
        >
          Sửa
        </button>
      </td>
      <td>
        <button
          type="button"
          onClick={() => handleDelete(category._id)}
          className="bg-red-500 text-white px-2 py-1"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
}

import React, { useState } from "react";

export default function ChildCategory({
  childCategory,
  setChildCategories,
  isUpdate,
  setIsUpdate,
}) {
  const [childCategoryName, setChildCategoryName] = useState(
    childCategory.name
  );
  const [isEditChildCategory, setIsEditChildCategory] = useState(false);

  const handleChange = (e) => {
    setChildCategoryName(e.target.value);
  };

  const handleEditCategory = async () => {
    try {
      const res = await fetch(
        `/api/category/edit-child-category/${childCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: childCategoryName }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setIsEditChildCategory(false);
        setChildCategoryName(data.name);
        setIsUpdate(!isUpdate);
        alert("Sửa thành công!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Có lỗi xảy ra khi sửa thẻ con!");
    }
  };

  const handleDeleteChildCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ con này không?")) {
      try {
        const res = await fetch(`/api/category/delete-child-category/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setChildCategories((prev) =>
            prev.filter((child) => child._id !== id)
          );
          alert("Xóa thành công!");
        } else {
          alert("Không thể xóa thẻ con.");
        }
      } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi xóa thẻ con!");
      }
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {isEditChildCategory ? (
        <div className="flex gap-2 items-center">
          <input
            onChange={handleChange}
            type="text"
            value={childCategoryName}
            className="border px-2 py-1"
          />
          <button
            type="button"
            onClick={handleEditCategory}
            className="border px-3 py-1 bg-green-500 text-white"
          >
            Save
          </button>
        </div>
      ) : (
        <>
        <div>{childCategoryName}</div>
        <div>{childCategory.quantity}</div>
        </>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditChildCategory(!isEditChildCategory)}
          className="border px-3 py-1 bg-blue-500 text-white"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteChildCategory(childCategory._id)}
          className="border px-3 py-1 bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

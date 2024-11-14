import React from 'react'

export default function Category({category,setCategories}) {
    const handleDelete=async (id) => {
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
  return (
    <tr>
    <td>{category.name}</td>
    <td>{category.quantity}</td>
    <td>
      <button type='button' onClick={()=>handleDelete(category._id)} className="bg-red-500 text-white px-2 py-1">
        Xóa
      </button>
    </td>
    <td>
      <button className="bg-red-500 text-white px-2 py-1">
        Sửa
      </button>
    </td>
  </tr>
  )
}

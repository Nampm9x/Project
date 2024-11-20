import React from "react";

export default function Product({product,setProducts}) {
    const handleDeleteProduct=async(id)=>{
        try{
            const res=await fetch(`/api/product/delete-product/${id}`,{
                method:"PUT",
            });
            const data=await res.json();
            alert(data.message);
            setProducts((prev) => prev.filter((item) => item._id !== id));
        }catch(error){
            console.log(error);
            alert("Xóa sản phẩm không thành công");
        }
    }
  return (
    <div className="mb-5">
      <img src={product.thumbnail} alt="" className="w-40 h-40" />
      <div>{product.name}</div>
      <div>{product.price}</div>
      <div>{product.category.name}</div>
      <button 
      type="button" 
      onClick={()=>handleDeleteProduct(product._id)} 
      className="border px-3 py bg-red-500">Xóa</button>
    </div>
  );
}

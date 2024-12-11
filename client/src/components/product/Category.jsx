import React, { useEffect, useState } from "react";

export default function Category({ category,setProducts }) {
  const [childCategories, setChildCategories] = useState([]);
  const [isShowChildCategories, setIsShowChildCategories] = useState(false);

  const handleShowChildCategories = () => {
    setIsShowChildCategories(!isShowChildCategories);
  };

  useEffect(() => {
    const fetchChildCategories = async () => {
      try {
        const res = await fetch(
          `api/category/get-child-categories/${category._id}`
        );
        const data = await res.json();
        setChildCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChildCategories();
  }, [category._id]);

  const fetchProductByCategory=async(id)=>{
    try{
        const res=await fetch(`/api/product/get-products-by-category/${id}`);
        const data=await res.json(200);
        setProducts(data);
    }catch(error){
        console.log(error);
    }
  }

  return (
    <>
      <div onClick={handleShowChildCategories}>{category.name}</div>
      {isShowChildCategories && (
        <div>
          {childCategories.map((child) => (
            <div onClick={()=>fetchProductByCategory(child._id)} key={child._id}>{child.name}</div>
          ))}
        </div>
      )}
    </>
  );
}

import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { logout } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function AdminHeader() {
  const router=useNavigate()
  const dispatch=useDispatch()
  const handleLogout=async()=>{
    try{
    const res=await fetch("/api/auth/logout",{
      method:"POST",
      headers:{
      "Content-Type":"application/json",
      }
    });
    const data=await res.json();
    if (res.ok){
      router("/")
      alert(data.message);
      dispatch(logout())
    } else{
      alert(data.message);
    } 
  } catch(error){
    console.log(error)
  }
} 
  return (
    <div className='flex gap-3 justify-center'>
        <Link className='border-2' to="/admin/users">Quan ly user</Link>
        <Link className='border-2' to="/admin/product-management">Quan ly san pham</Link>
        <Link className='border-2' to="/admin/coupon">Quan ly ma giam gia</Link>
        <Link className='border-2' to="/admin/category-management">Quan ly danh muc</Link>
        <Link className='border-2' to="/admin/order">Quan ly don hang</Link>
        <button type='button' onClick={handleLogout}>Logout</button>
    </div>
  )
}

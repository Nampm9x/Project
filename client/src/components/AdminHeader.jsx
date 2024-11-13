import React from 'react'
import { Link } from 'react-router-dom';


export default function AdminHeader() {
  return (
    <div className='flex gap-3 justify-center'>
        <Link className='border-2' to="/admin/users">Quan ly user</Link>
        <Link className='border-2' to="/admin/product-management">Quan ly san pham</Link>
        <Link className='border-2' to="/admin/coupon">Quan ly ma giam gia</Link>
        <Link className='border-2' to="/admin/category">Quan ly danh muc</Link>
        <Link className='border-2' to="/admin/category">Quan ly don hang</Link>
    </div>
  )
}

import { useState } from "react";
import {useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({});
  const router = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();

      if (res.ok) {
        router("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <form onSubmit={handleSubmit} className="px-10 border py-10">
        <h2 className="text-center">Đăng ký</h2>
        <div className="pt-3 flex gap-3">
          <label htmlFor="name">Tên người dùng</label>
          <input onChange={handleChange} className="w-full border" type="text" id="name" name="name" required />
        </div>
        <div className="pt-3 flex gap-3">
          <label htmlFor="email">Email</label>
          <input onChange={handleChange} className="w-full border" type="email" id="email" name="email" required />
        </div>
        <div className="pt-3 flex gap-3">
          <label htmlFor="password">Mật khẩu</label>
          <input onChange={handleChange} className="w-full border" type="password" id="password" name="password" required />
        </div>
        <div className=''>
        Đã có tài khoản?<Link className='hover:underline' to="/login">Đăng nhập</Link>
        </div>
        <div className="flex justify-center mt-4">
        <button type="submit" className="border bg-green-400 hover:bg-white hover:text-green-400 text-white px-3 py-1">Đăng ký</button>
        </div>
      </form>
    </div>
  );
}
import {useState} from 'react'
import {Link, useNavigate } from "react-router-dom";
import { login } from '../redux/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';

export default function Login() {
  const [formData, setFormData] = useState({});
  const router = useNavigate();

  const dispatch=useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();


      if (res.ok) {
        dispatch(login(data));
        if (data.isAdmin) {
          router("/admin");
        } else {
          const redirectCart = localStorage.getItem("redirect-cart");
          if (redirectCart) {
            router(redirectCart);
            localStorage.removeItem("redirect-cart");
          } else {
            router("/");
          }
        }
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
        <h2 className="text-center">Đăng nhập</h2>
        <div className="pt-3 flex gap-3">
          <label htmlFor="email">Email</label>
          <input onChange={handleChange} className="w-full border" type="email" id="email" name="email" required />
        </div>
        <div className="pt-3 flex gap-3">
          <label htmlFor="password">Mật khẩu</label>
          <input onChange={handleChange} className="border" type="password" id="password" name="password" required />
        </div>
        <div className=''>
        Chưa có tài khoản?<Link className='hover:underline' to="/register">Đăng ký</Link>
        </div>
        <div className="flex justify-center mt-4">
        <button type="submit" className="border bg-green-400 hover:bg-white hover:text-green-400 text-white px-3 py-1">Đăng nhập</button>
        </div>
      </form>
    </div>
  );
}
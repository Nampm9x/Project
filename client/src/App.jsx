import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Test from "./pages/Test";
import { useSelector } from "react-redux";
import AdminHeader from "./components/AdminHeader";
import AdminHome from "./pages/admin/AdminHome";
import ProductManagement from "./pages/admin/ProductManagement";

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <BrowserRouter>
        {currentUser && currentUser.isAdmin ? <AdminHeader /> : <Header />}
        <Routes>
          {currentUser && currentUser.isAdmin ? (
            <>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/product-management" element={<ProductManagement />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<Test />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
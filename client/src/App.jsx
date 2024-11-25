import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import AdminHeader from "./components/AdminHeader";
import AdminHome from "./pages/admin/AdminHome";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <MainContent currentUser={currentUser} />
    </BrowserRouter>
  );
}

function MainContent({ currentUser }) {
  const location = useLocation(); //
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {currentUser && currentUser.isAdmin && isAdminPath ? (
        <AdminHeader />
      ) : (
        <Header />
      )}
      <Routes>
        {currentUser && currentUser.isAdmin && isAdminPath ? (
          <>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/product-management" element={<ProductManagement />} />
            <Route path="/admin/category-management" element={<CategoryManagement />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Product />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id"element={<ProductDetail/>}/>
            {currentUser ? (
              <Route path="/cart" element={<Cart />} />
            ) : (
              <Route path="/cart" element={<Login />} />
            )}
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
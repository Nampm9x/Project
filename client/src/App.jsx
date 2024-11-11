import{BrowserRouter, Route, Routes} from 'react-router-dom'
import Header from "./components/Header"
import Home from './pages/Home'
import Product from'./pages/Product'
import Register from './pages/Register'
import Login from './pages/Login' 
import Test from './pages/Test'

function App() {
  return (
  <>
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/product' element={<Product />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/test" element={<Test/>}/>
    </Routes>
    </BrowserRouter>
  </>
  )
}

export default App

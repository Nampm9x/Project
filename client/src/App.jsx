import{BrowserRouter, Route, Routes} from 'react-router-dom'
import Header from "./components/Header"
import Home from './pages/Home'
import Product from'./pages/Product'

function App() {
  return (
  <>
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/product' element={<Product />} />
    </Routes>
    </BrowserRouter>
  </>
  )
}

export default App

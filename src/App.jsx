import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Products from './pages/Products.jsx'
import ProductShow from './pages/ProductShow.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderDone from './pages/OrderDone.jsx'
import Wishlist from './pages/Wishlist.jsx'
import { Login, Register, Account } from './pages/Auth.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/books" element={<Products type="book" />} />
        <Route path="/accessories" element={<Products type="accessory" />} />
        <Route path="/product/:id" element={<ProductShow />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderDone />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

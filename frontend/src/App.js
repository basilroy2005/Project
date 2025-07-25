import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop.jsx';
import ShopCategory from './Pages/ShopCategory.jsx';
import Product from './Pages/Product.jsx';
import Cart from './Pages/Cart.jsx';
import LoginSignup from './Pages/LoginSignup.jsx';
import Footer from './Components/Footer/Footer.jsx';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import Buy from './Pages/Buy.jsx';
import Profile from './Pages/Profile.jsx';
import Admin from './Pages/Admin.jsx'; // <-- Update import
function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner}category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner}category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner}category="kid" />} />
          <Route path="/product">
            <Route index element={<Product />} />
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
<Route path='/buy' element={<Buy/>} />
<Route path='/profile' element={<Profile/>} />
<Route path='/admin' element={<Admin />} /> {/* <-- Add this line */}
        </Routes>

        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
        <Footer/>

      </BrowserRouter>
    </div>
  );
}

export default App;

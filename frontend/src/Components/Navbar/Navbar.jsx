import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext';
const Navbar = () => {
const [menu,setMenu] = useState("shop");

const {getTotalCartItems}=useContext(ShopContext);


  return (
    <div className='navbar'>
<div className="nav-logo">
      <img src={logo} alt="Logo" className='logo' />
      <p>SHOPPER</p>
</div>
<ul className='nav-menu'>
      <li onClick={() => { setMenu("shop") }}><Link style={{ textDecoration: 'none'}} to='/'>Shop</Link> {menu === "shop" ? <hr /> : <></>}</li>
      <li onClick={() => { setMenu("mens") }}><Link style={{ textDecoration: 'none'}} to='/mens'>Men</Link>{menu === "mens" ? <hr /> : <></>}</li>
      <li onClick={() => { setMenu("womens") }}><Link style={{ textDecoration: 'none'}} to='/womens'>Women</Link>{menu === "womens" ? <hr /> : <></>}</li>
      <li onClick={() => { setMenu("kids") }}><Link style={{ textDecoration: 'none'}} to='/kids'>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
</ul>
<div className="nav-login-cart">
  {localStorage.getItem('auth-token')
    ? <button onClick={() => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('isAdmin'); // Remove admin flag on logout
        window.location.replace('/');
      }}>Logout</button>
    : <Link to='/login'><button>Login</button></Link>
  }

  {localStorage.getItem('auth-token')
    ? <Link to='/profile'><button>Profile</button></Link>
    : null
  }

  {/* Show Admin Panel button only if isAdmin is true */}
  {localStorage.getItem('auth-token') && localStorage.getItem('isAdmin') === 'true'
    ? <a href="http://localhost:5173/"><button>Admin</button></a>
    : null
  }

  <Link to='/cart'><img src={cart_icon} alt="Cart"/></Link>
  <div className="nav-cart-count">{getTotalCartItems()}</div>
</div>
    </div>
  ) 
}

export default Navbar
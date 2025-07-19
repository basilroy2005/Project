import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from'../../assets/nav-profile.svg'

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.href = 'http://localhost:3000/'; // Change to your frontend homepage URL
  };

  return (
    <div className='navbar'>
      <img src={navlogo} alt="" className="nav-logo"/>
      <img src={navProfile}  className='nav-profile' alt="" />
      <button onClick={handleLogout} style={{marginLeft: 'auto'}}>Logout</button>
    </div>
  )
}

export default Navbar
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import compressoLogoDark from "../../assets/images/icons/logo-dark.svg";
import compressoLogoLight from "../../assets/images/icons/logo-light.svg";
import shopIcon from "../../assets/images/icons/cart-dark.svg";
import userIcon from "../../assets/images/icons/user-dark.svg";
import searchIcon from "../../assets/images/icons/icons8-search.svg";
import DropdownMenu from "./ProductsDropdownMenu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate(); // React Router hook for navigation
  const location = useLocation(); // React Router hook for current path

  const isAdminRoute = location.pathname.startsWith("/admin"); // Check if current route is admin
  const isLoginPage = location.pathname === "/admin/login"; // Check if current route is login page

  useEffect(() => {
    // Check login status from sessionStorage
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Check login status on hover
  const handleUserIconHover = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate("/"); // Redirect to MainPage
  };

  // Handle back to user page
  const handleBackToUserPage = () => {
    navigate("/"); // Redirect to MainPage
  };

  if (isAdminRoute) {
    // Admin Navbar
    return (
      <nav className="admin-navbar">
        <div className="navbar-left">
          <img src={compressoLogoLight} alt="Compresso Logo" className="navbar-logo" />
          <span className="admin-navbar-title"> │ Admin Side</span>
        </div>
        <div className="navbar-right">
          {isLoginPage && !isLoggedIn ? (
            <button className="back-to-user-button" onClick={handleBackToUserPage}>
              Back to User Page
            </button>
          ) : (
            <button className="admin-logout-button" onClick={handleAdminLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    );
  }

  // User Navbar
  return (
    <nav className="navbar">
      <img src={compressoLogoDark} alt="Compresso Logo" className="navbar-logo" />
      <div className="navbar-center">
        <ul className="navbar-links">
          <li><Link to="/">HOME</Link></li>
          <DropdownMenu /> {/* Use the DropdownMenu component */}
          <li><Link to="/about">ABOUT US</Link></li>
          <li><a href="#contact">CONTACT</a></li>
        </ul>
      </div>
      <div className="navbar-right">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <img src={searchIcon} alt="Search" className="search-icon" />
          </button>
        </form>
        <div 
          className="user-icon-container" 
          onMouseEnter={handleUserIconHover}
        >
          <img src={userIcon} alt="User Icon" className="user-icon" />
          <div className="user-dropdown">
            {isLoggedIn ? (
              <>
                <Link to="/my-orders">My Orders</Link>
                <Link to="/wishlist">Wishlist</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
        <Link to="/cart"><img src={shopIcon} alt="Shop Icon" className="shop-icon" /></Link>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useRef,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { createPortal } from "react-dom";
import "./Header.css";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const [show, setShow] = useState(false);
  const hideTimeout = useRef(null);
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState(""); // search state

  // Read username from localStorage on mount
  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);
  
  //user icon
  const handleEnter = () => {
    clearTimeout(hideTimeout.current);// cancel any hide timer
    setShow(true);// show immediately
  };

  const handleLeave = () => {
    hideTimeout.current = setTimeout(() => setShow(false), 150);// hide after delay
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value); // send search term to parent
  };

// Check if we are on the ProductList page
  const showSearch = location.pathname === "/productslist"; 
  // you can extend: ['/productslist', '/another-page'].includes(location.pathname)

  return (
    <header className="app-header">
      <h1 className="logo" onClick={() => navigate("/home")}>GiftStore</h1>

      {/* Render search bar only on ProductList page */}
      {showSearch && (
        <input
          type="text"
          className="search-input"
          placeholder="Search gifts..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      )}

      <nav className="nav-links">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/productslist")}>Products</button>
        <button onClick={() => navigate("/cart")}>Cart</button>
        {/* <button onClick={() => navigate("/giftMessage")}>Gift Message</button> */}
        <div className="user-icon" onMouseEnter={handleEnter} onMouseLeave={handleLeave}><FaUser /></div>
      </nav>

      {show &&
        createPortal(
          <div className="global-dropdown" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {username && (
              <div className="dropdown-name">Hello, {username}</div>
            )}
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  alert("Logged out");
                }
              }}
            >
              Logout
            </button>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;

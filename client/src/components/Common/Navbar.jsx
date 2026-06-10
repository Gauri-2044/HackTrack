import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../../styles/Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <nav className="navbar">

        <div className="logo">
          <img src="/logo.png" alt="Main-website-logo" height="60px" width="200px"></img>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#workflow">Workflow</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="nav-actions">
          {isLoginPage ? (
            <Link to="/register" className="login-btn">
              Register
            </Link>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </nav>

      {menuOpen && (
        <div className="mobile-menu">

          <Link to="/">Home</Link>

          <a href="#features">Features</a>

          <a href="#workflow">Workflow</a>

          <a href="#pricing">Pricing</a>

          <a href="#contact">Contact</a>

          {isLoginPage ? (
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}

        </div>
      )}
    </>
  );
}

export default Navbar;
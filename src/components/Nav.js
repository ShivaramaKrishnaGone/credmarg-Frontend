import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return isLoggedIn ? (
    <nav className="nav-container">
      <ul className="nav-links">
        <li>
          <Link to="/employees">Employees</Link>
        </li>
        <li>
          <Link to="/vendors">Vendors</Link>
        </li>
        <li>
          <Link to="/send-emails">Send Emails</Link>
        </li>
      </ul>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  ) : null;
};

export default Nav;

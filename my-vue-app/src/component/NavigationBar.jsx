import "./NavigationBar.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { RxDropdownMenu } from "react-icons/rx";
import { useEffect, useState } from "react";

function NavigationBar() {
  const navigate = useNavigate();

  // Lấy trạng thái đăng nhập từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component render
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true"; // Trả về true hoặc false từ localStorage
    setIsLoggedIn(loginStatus);
  }, []);

  // State để quản lý dropdown menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập
    localStorage.removeItem("studentId");
    setIsLoggedIn(false); // Đặt lại trạng thái đăng nhập
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <nav className="navigation-bar">
      <img src={logo} alt="Logo" className="navigation-logo" /> 
      <Link to={isLoggedIn ? "/Homepage/User" : "/"}>
        <span className="BKSPSS">BK SSPS</span>
      </Link>
      <ul className="navigation-menu">
        <Link to={isLoggedIn ? "/Homepage/User" : "/"}><li>Home</li></Link>
        <Link to={isLoggedIn ? "/Print" : "/"}><li>Print</li></Link>
        <Link to={isLoggedIn ? "/history" : "/"}><li>History</li></Link>
        <Link to={isLoggedIn ? "/page-purchase" : "/"}><li>Page Purchase</li></Link>
        <Link to={isLoggedIn ? "/help" : "/"}><li>Help</li></Link>
      </ul>

      {!isLoggedIn ? (
        <Link to="/chooseRole">
          <span className="login">Log in</span>
        </Link>
      ) : (
        <div className="user-icon-container" onClick={toggleDropdown}>
          <span className="user_icon">
            <FaCircleUser size="40" />
            <div className="user">User</div> 
            <div className="dropmenu"><RxDropdownMenu /></div>
          </span>
        </div>
      )}

      {isDropdownOpen && isLoggedIn && (
        <div className="dropdown-menu">
          <ul>
            <Link to="/profile">
              <li>Dashboard</li>
            </Link>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;

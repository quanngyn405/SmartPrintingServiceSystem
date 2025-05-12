import "./NavigationBar_Ad.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { RxDropdownMenu } from "react-icons/rx";
import { useEffect, useState } from "react";

function NavigationBar_Ad() {
  const navigate = useNavigate();

  // Lấy trạng thái đăng nhập admin từ localStorage
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isAdminLoggedIn");
    setIsAdminLoggedIn(loginStatus === "true"); // Cập nhật trạng thái đăng nhập
  }, []);

  // State để quản lý dropdown menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn"); // Xóa trạng thái đăng nhập admin
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <nav className="admin-navigation-bar">
      <img src={logo} alt="Logo" className="admin-navigation-logo" />
      <Link to={isAdminLoggedIn ? "/Homepage/Admin" : "/"}>
        <span className="admin-BKSPSS">BK SSPS</span>
      </Link>
      <ul className="admin-navigation-menu">
        <Link to={isAdminLoggedIn ? "/Homepage/Admin" : "/"}><li>Home</li></Link>
        <Link to={isAdminLoggedIn ? "/manage" : "/"}><li>Manage</li></Link>
        <Link to={isAdminLoggedIn ? "/admin/history" : "/"}><li>History</li></Link>
        <Link to={isAdminLoggedIn ? "/report" : "/"}><li>Report</li></Link>
      </ul>

      {!isAdminLoggedIn ? (
        <Link to="/chooseRole">
          <span className="admin-login">Log in</span>
        </Link>
      ) : (
        <div className="user-icon-container" onClick={toggleDropdown}>
          <span className="user_icon">
            <FaCircleUser size="40" />
            <div className="user">Admin</div> 
            <div className="dropmenu"><RxDropdownMenu /></div>
          </span>
        </div>
      )}

      {isDropdownOpen && isAdminLoggedIn && (
        <div className="admin-dropdown-menu">
          <ul>
            <Link to="/Admin/Setup">
              <li>Set Up</li>
            </Link>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar_Ad;

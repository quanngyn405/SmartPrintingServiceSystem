import { useNavigate } from "react-router-dom";
import NavigationBar_Ad from "../../component/NavigationBar_Ad";
import "./Home_Admin.css";
import { useEffect } from "react";

function Admin_HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/"); // Điều hướng về trang chủ nếu chưa đăng nhập
    }
  }, [navigate]);

  return (
    <div className="Admin_Hinhnen">
      <NavigationBar_Ad />
    </div>
  );
}

export default Admin_HomePage;

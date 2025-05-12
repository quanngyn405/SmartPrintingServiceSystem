import { useNavigate } from "react-router-dom";
import NavigationBar from "../../component/NavigationBar";
import "./Home_User.css";
import { useEffect } from "react";
const studentInfo = localStorage.getItem("studentInfo");



function User_HomePage() {
    const navigate = useNavigate();
    console.log(JSON.parse(studentInfo).student_id)
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        navigate("/"); // Điều hướng về trang chủ nếu chưa đăng nhập
      }
    }, [navigate]);
    return (
        <div className="User_Hinhnen">
            <NavigationBar />
        </div>
    );
}

export default User_HomePage;
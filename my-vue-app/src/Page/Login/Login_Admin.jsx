import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Login_Admin.css";
import NavigationBar from "../../component/NavigationBar";

function Login_Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      // Fetch user data by username
      const response = await fetch(`http://localhost:5000/api/users/namename/${username}`);
      console.log(response)
      const result = await response.json();
      console.log(result.data)
      if (!result.success) {
        alert("Invalid username or password");
        return;
      }

      const user = result.data;

      // Check if the password and role match
      if (user.password === password && user.role === "spso") {
        localStorage.setItem("isAdminLoggedIn", "true"); // Store login state
        navigate("/Homepage/Admin"); // Navigate to User Home
      } else {
        alert("Invalid username, password, or role");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="login_admin_hinhnen">
      <NavigationBar />
      <div className="login_admin">
        <div className="logo_admin">
          <img src={logo} alt="logo" />
          <h1>Admin Log in</h1>
        </div>
        <div className="user_pass_admin">
          <div className="userName_admin">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="pass_admin">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="button_admin_login">
          <Link to="/">
            <button>Cancel</button>
          </Link>
          <button onClick={handleAdminLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login_Admin;

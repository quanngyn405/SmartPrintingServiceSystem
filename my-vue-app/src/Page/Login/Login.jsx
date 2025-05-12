import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "../../component/NavigationBar";
import logo from "../../assets/logo.png";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState(""); // State to store username
  const [password, setPassword] = useState(""); // State to store password
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/student/${username}`);
      const result = await response.json();
      console.log(result.data)
      if (!result.success) {
        alert("Invalid username or password");
        return;
      }

      const user = result.data;
      console.log(user)
      if (user.password === password && user.role === "student") {
        localStorage.setItem("isLoggedIn", "true"); // Store login state
        localStorage.setItem("studentInfo", JSON.stringify(user))
        navigate("/Homepage/User"); // Navigate to User Home
      } else {
        alert("Invalid username, password, or role");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="login_hinhnen">
      <NavigationBar />
      <div className="login_login">
        <div className="logo_login">
          <img src={logo} alt="logo" />
          <h1>Log in</h1>
        </div>
        <div className="user_pass">
          <div className="userName">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username
            />
          </div>
          <div className="pass">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password
            />
          </div>
        </div>
        <div className="button_login">
          <Link to="/">
            <button>Cancel</button>
          </Link>
          <button onClick={handleLogin}>Login</button> {/* Attach login event */}
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import anime from "animejs";
import axios from "axios";
import "./AdminLoginPage.css";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  let current = null;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/admin/main_page"); // Redirect if already logged in
    }

    document.body.classList.add("adminlogin-body");
    return () => {
      document.body.classList.remove("adminlogin-body");
      // Clear token on navigation away
      localStorage.removeItem("token");
    };
  }, [navigate]);

  const handleFocus = (offset, dashArray) => {
    if (current) current.pause();
    current = anime({
      targets: "path",
      strokeDashoffset: {
        value: offset,
        duration: 700,
        easing: "easeOutQuart",
      },
      strokeDasharray: {
        value: dashArray,
        duration: 700,
        easing: "easeOutQuart",
      },
    });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:5001/auth/login", {
            email,
            password,
        });

        const { token, role } = response.data;

        // Save token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Check if the user is authorized for admin panel
        if (role === "product_manager" || role === "sales_manager") {
            alert("Welcome, Admin!");
            navigate("/admin/main_page");
        } else {
            setLoginError("You are not authorized to access the admin panel.");
        }
    } catch (error) {
        setLoginError(error.response?.data?.error || "Invalid email or password.");
    }
};


  

  return (
    <div className="admin-login-page">
      <div className="container">
        <div className="left">
          <div className="login">Login</div>
          <div className="eula">Welcome admin.</div>
        </div>
        <div className="right">
          <svg viewBox="0 0 320 300">
            <defs>
              <linearGradient
                id="linearGradient"
                x1="13"
                y1="193.5"
                x2="307"
                y2="193.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop style={{ stopColor: "#ff00ff" }} offset="0" />
                <stop style={{ stopColor: "#ff0000" }} offset="1" />
              </linearGradient>
            </defs>
            <path d="m 40,120.00016 239.99984,-3.2e-4 ..." />
          </svg>
          <div className="form">
            <form onSubmit={handleAdminLogin}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus(0, "240 1386")}
                required
                placeholder="Enter admin email"
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus(-336, "240 1386")}
                required
                placeholder="Enter password"
              />
              <input
                type="submit"
                id="submit"
                value="Submit"
                onFocus={() => handleFocus(-730, "530 1386")}
              />
              {loginError && <div className="adminlogin-error">{loginError}</div>}
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

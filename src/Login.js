import { useState } from "react";
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // added axios

function Login() {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();
    const [LoginMessage, setLoginMessage] = useState('');

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setLoginMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/users/login", loginData);

            const user = response.data; // should return user object from backend {id, username, ...}

            if (loginData.username === "admin" && loginData.password === "admin") {
                localStorage.setItem("role", "admin");
                localStorage.setItem("username", "admin");
            } else {
                localStorage.setItem("role", "user");
                localStorage.setItem("username", user.username); // from backend response
            }
            navigate("/home");

            if (user && user.id) {
                // Store userId and username in localStorage
                localStorage.setItem("userId", user.id);
                localStorage.setItem("username", user.username);

                setLoginMessage("Login successful!");
                navigate("/home"); // redirect to cart after login
            } else {
                setLoginMessage("Invalid username or password");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setLoginMessage("Login failed. Invalid username or password.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login Form</h2>

                {LoginMessage && <h3 style={{ color: 'red' }}>{LoginMessage}</h3>}

                <label>UserName:</label>
                <input name="username" value={loginData.username} onChange={handleChange} />

                <label>Password:</label>
                <input name="password" type="password" value={loginData.password} onChange={handleChange} />

                <button type="submit">Login</button>

                <Link to="/register" style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}>
                    New to create? <span style={{ color: 'blue', fontWeight: 'bold' }}>Create Account</span>
                </Link>
            </form>
        </div>
    );
}

export default Login;

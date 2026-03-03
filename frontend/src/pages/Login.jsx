import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  try {
    const res = await API.post("login/", form);

    const role = res.data.role.toLowerCase();

localStorage.setItem("access", res.data.access);
localStorage.setItem("refresh", res.data.refresh);
localStorage.setItem("role", role);

console.log("ROLE:", role);

if (role === "admin") {
  console.log("GOING TO ADMIN");
  navigate("/admin");
} else {
  console.log("GOING TO DASHBOARD");
  navigate("/dashboard");
}

  } catch (error) {
    console.log(error.response?.data);
    alert("Invalid username or password");
  }
};


return (
  <div className="auth-page">

    <div className="auth-overlay">

      <div className="page-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p onClick={() => navigate("/register")}>
          Create new account
        </p>

        <p
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </p>

      </div>

    </div>

  </div>
);
}

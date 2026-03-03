import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();


  if (form.password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    alert("Enter a valid email address.");
    return;
  }

  try {
    await API.post("register/", form);
    alert("Registration successful!");
    navigate("/login");
  } catch (error) {
    console.log(error.response?.data);
    alert("Registration failed");
  }
};


  return (
    <div className="auth-page">
  <div className="auth-overlay">

    <div className="page-card">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      <p onClick={() => navigate("/login")}>Already have an account? Login</p>
      <p className="back-home" onClick={() => navigate("/")}>
             ← Back to Home </p>

    </div>
      </div>

  </div>
  );
}

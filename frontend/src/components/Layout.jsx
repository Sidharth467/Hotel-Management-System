import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          Marriott
        </h2>

        <div className="nav-links">
          <span onClick={() => navigate("/dashboard")}>Home</span>
          <span onClick={() => navigate("/booking")}>Book Room</span>
          <span onClick={() => navigate("/my-bookings")}>My Bookings</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}
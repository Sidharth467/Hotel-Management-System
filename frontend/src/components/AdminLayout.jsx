import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-fullscreen">
      <nav className="admin-navbar">
        <div className="admin-nav-inner">
          <h2 onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
            Admin Panel
          </h2>

          <div className="admin-links">
            <span onClick={() => navigate("/admin")}>Dashboard</span>
            <span onClick={() => navigate("/admin/rooms")}>Rooms</span>
            <span onClick={() => navigate("/admin/bookings")}>Bookings</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
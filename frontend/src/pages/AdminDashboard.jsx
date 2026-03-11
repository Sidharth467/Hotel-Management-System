import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    total_rooms: 0,
    active_bookings: 0,
    total_revenue: 0
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    const res = await API.get("admin/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setStats(res.data);
  };

  return (
<div className="admin-fullscreen admin-dashboard">

      <h1>Admin Dashboard</h1>
      <p>Hotel performance overview</p>

      {/* STATS */}
      <div className="admin-cards">

        <div className="admin-card">
          <h3>Total Rooms</h3>
          <p>{stats.total_rooms}</p>
        </div>

        <div className="admin-card">
          <h3>Active Bookings</h3>
          <p>{stats.active_bookings}</p>
        </div>

        <div className="admin-card">
          <h3>Total Revenue</h3>
          <p>₹{stats.total_revenue}</p>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="admin-actions">

        <button onClick={() => navigate("/admin/rooms")}>
          Manage Rooms
        </button>

        <button onClick={() => navigate("/admin/bookings")}>
          Manage Bookings
        </button>

        {/* <button onClick={() => navigate("/admin/amenities")}>
          Manage Amenities
        </button> */}

      </div>

    </div>
  );
}
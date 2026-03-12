import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();
  const [latestBooking, setLatestBooking] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  const fetchBookings = async () => {

    const token = localStorage.getItem("access");

    const res = await API.get("my-bookings/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.length > 0) {
      setLatestBooking(res.data[0]); // latest booking
    }
  };

  const fetchProfile = async () => {

    const token = localStorage.getItem("access");

    const res = await API.get("profile/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUsername(res.data.name || res.data.username);
  };

  return (

    <div className="dashboard-page">

      {/* Greeting */}
      <div className="dashboard-header">
        <h1>Hi {username} 👋</h1>
        <p>Welcome back to Marriott. Manage your bookings easily.</p>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">

        <div
          className="action-card"
          onClick={() => navigate("/booking")}
        >
          Book a Room
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/my-bookings")}
        >
          View My Bookings
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/profile")}
        >
          Edit Profile
        </div>

      </div>

      {/* Latest Booking */}
      {latestBooking && (

        <div className="latest-booking">

          <h2>Upcoming Reservation</h2>

          <div className="booking-card">

            <img
              src={`https://hotel-management-system-boy7.onrender.com${latestBooking.room.image}`}
              alt="room"
            />

            <div className="booking-info">

              <h3>{latestBooking.room.room_type}</h3>

              <p>Room: {latestBooking.room.room_number}</p>
              <p>Check-in: {latestBooking.check_in_date}</p>
              <p>Check-out: {latestBooking.check_out_date}</p>
              <p>Guests: {latestBooking.guests}</p>

              <p className="status">
                Status: {latestBooking.status}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
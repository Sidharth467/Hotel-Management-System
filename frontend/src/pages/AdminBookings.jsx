import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await API.get("admin/bookings/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(
      `admin/update-booking/${id}/`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchBookings();
  };

  return (
    <>
      <h2>Manage Bookings</h2>

     {bookings.map((booking) => (

  <div key={booking.id} className="admin-booking-row">

    <img
      src={`http://127.0.0.1:8000${booking.room.image}`}
      width="80"
    />

    <div>
      <strong>Room {booking.room.room_number}</strong>
      <p>{booking.room.room_type}</p>
    </div>

    <div>
      <p>Check-in: {booking.check_in_date}</p>
      <p>Check-out: {booking.check_out_date}</p>
    </div>

    <div>
      Status: <b>{booking.status}</b>
    </div>

    <button onClick={() => updateStatus(booking.id, "completed")}>
      Complete
    </button>

    <button onClick={() => updateStatus(booking.id, "cancelled")}>
      Cancel
    </button>

  </div>

))}
    </>
  );
}
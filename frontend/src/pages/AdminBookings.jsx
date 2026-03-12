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
     <div className="admin-dashboard">
      <h2>Manage Bookings</h2>

     {bookings.map((booking) => (

  <div key={booking.id} className="admin-booking-row">

    <img
      src={`https://hotel-management-system-boy7.onrender.com${booking.room.image}`}
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
      Checkout
    </button>

    <button onClick={() => updateStatus(booking.id, "cancelled")}>
      Cancel
    </button>

  </div>
 

))} 
</div>
    </>
  );
}
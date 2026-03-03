import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyBookings() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    const token = localStorage.getItem("access");

    const res = await API.get("my-bookings/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBookings(res.data);
  };

  return (

    <div className="booking-container">

      <h2>My Bookings</h2>

      <table className="booking-table">

        <thead>
          <tr>
            <th>Room Image</th>
            <th>Room Type</th>
            <th>Room No</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Guests</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {bookings.map((booking) => (

            <tr key={booking.id}>

              <td>
                <img
                  src={`http://127.0.0.1:8000${booking.room.image}`}
                  className="table-room-img"
                />
              </td>

              <td>{booking.room.room_type}</td>

              <td>{booking.room.room_number}</td>

              <td>{booking.check_in_date}</td>

              <td>{booking.check_out_date}</td>

              <td>{booking.guests}</td>

              <td>₹{booking.total_price}</td>

             <td className={`status-${booking.status}`}>
{booking.status}
</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}
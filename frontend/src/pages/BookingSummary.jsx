import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function BookingSummary() {

  const location = useLocation();
  const navigate = useNavigate();

  const { room, dates, guests: initialGuests } = location.state;

  const [guests, setGuests] = useState(initialGuests);

  const checkIn = new Date(dates.check_in_date);
  const checkOut = new Date(dates.check_out_date);

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const totalPrice = nights * Number(room.price_per_night) * guests;

  const handleConfirm = async () => {

    const token = localStorage.getItem("access");
    console.log("TOKEN:", localStorage.getItem("access"));

    await API.post(
      "book-room/",
      {
        room: room.id,
        check_in_date: dates.check_in_date,
        check_out_date: dates.check_out_date,
        guests: guests
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Booking Confirmed!");

    navigate("/dashboard");

  };

  return (

    <div className="booking-summary">
      

      <div className="summary-card">

        <img
          src={`http://127.0.0.1:8000${room.image}`}
          className="summary-image"
        />

        <h3>{room.room_type}</h3>

        <p>Room No: {room.room_number}</p>

        <div className="summary-amenities">
          {room.amenities?.map((a, i) => (
            <span key={i}>{a}</span>
          ))}
        </div>

        <hr />

        <p>Check-in: {dates.check_in_date}</p>
        <p>Check-out: {dates.check_out_date}</p>

        <p>Nights: {nights}</p>

        {/* Guests */}
        <div className="guest-selector">

          <label>Guests</label>

          <div className="guest-controls">

            <button
              disabled={guests === 1}
              onClick={() => setGuests(guests - 1)}
            >
              -
            </button>

            <span>{guests}</span>

            <button
              disabled={guests === 4}
              onClick={() => setGuests(guests + 1)}
            >
              +
            </button>

          </div>

        </div>

        <hr />

        <h3>Total Price: ₹{totalPrice}</h3>

        <div className="summary-actions">

  <button
    className="back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back to Rooms
  </button>

  <button onClick={handleConfirm}>
    Confirm Booking
  </button>

</div>
      </div>

    </div>
  );
}
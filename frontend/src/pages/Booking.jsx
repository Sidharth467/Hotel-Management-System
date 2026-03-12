import { useEffect, useState } from "react";
import API from "../services/api";
import { FaWifi, FaTv, FaSnowflake, FaCar, FaCoffee, FaDoorOpen } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import SliderModule from "react-slick";
const Slider = SliderModule.default;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Booking() {

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};
  const amenityIcons = {
  WiFi: <FaWifi />,
  AC: <FaSnowflake />,
  TV: <FaTv />,
  Parking: <FaCar />,
  Breakfast: <FaCoffee />,
  Balcony: <FaDoorOpen />
};

  const [dates, setDates] = useState({
    check_in_date: "",
    check_out_date: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await API.get("rooms/");
    setRooms(res.data);
  };

const handleBooking = () => {

  if (!dates.check_in_date || !dates.check_out_date) {
    setError("Please select check-in and check-out dates.");
    return;
  }

  const checkIn = new Date(dates.check_in_date);
  const checkOut = new Date(dates.check_out_date);

  if (checkOut <= checkIn) {
    setError("Check-out must be after check-in.");
    return;
  }

  setError("");

  navigate("/booking-summary", {
    state: {
      room: selectedRoom,
      dates: dates,
      guests: guests
    }
  });

};

  return (
    <div className="booking-container">

      <h2>Available Rooms</h2>

      {/* ROOM GRID */}
      <div className="room-grid">

        {rooms.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() => setSelectedRoom(room)}
          >

                    <img
          src={`https://hotel-management-system-boy7.onrender.com${room.image}`}
          alt="room"
          className="room-image"
        />

        <div className="room-info">

          <h3>{room.room_type}</h3>
          <p>Room No: {room.room_number}</p>
          <p className="price">₹{room.price_per_night} / night</p>

          <div className="room-amenities">
          {room.amenities?.map((a, index) => (
  <span key={a.id || index} className="amenity">
    {amenityIcons[a] || "•"}
  </span>
))}
          </div>

        </div>
          </div>
        ))}

      </div>

      {/* ROOM DETAIL MODAL */}
      {selectedRoom && (

        <div className="room-modal">

          <div className="modal-card">

  <Slider {...settings}>
  {selectedRoom.images?.length > 0 ? (
    selectedRoom.images.map((img, index) => (
      <div key={index}>
        <img
          src={`https://hotel-management-system-boy7.onrender.com${img.image}`}
          className="modal-carousel-img"
        />
      </div>
    ))
  ) : (
    <div>
      <img
        src={`https://hotel-management-system-boy7.onrender.com${selectedRoom.image}`}
        className="modal-carousel-img"
      />
    </div>
  )}
</Slider>
            <h2>{selectedRoom.room_type}</h2>
            <p>{selectedRoom.description}</p>
            <div className="modal-amenities">

  {selectedRoom.amenities?.map((a, index) => (

    <div key={index} className="modal-amenity">

      <span className="icon">{amenityIcons[a]}</span>
      <span>{a}</span>

    </div>

  ))}

</div>

            <p>Price: ₹{selectedRoom.price_per_night} / night</p>

          <div className="booking-dates">

  <div className="date-field">
    <label>Check-in</label>
    <input
      type="date"
      value={dates.check_in_date}
      onChange={(e) =>
        setDates({ ...dates, check_in_date: e.target.value })
      }
    />
  </div>

  <div className="date-field">
    <label>Check-out</label>
    <input
      type="date"
      value={dates.check_out_date}
      onChange={(e) =>
        setDates({ ...dates, check_out_date: e.target.value })
      }
    />
  </div>   </div>
            {/* GUEST SELECTOR */}

          <div className="guest-selector">

  <label>Guests</label>

  <div className="guest-controls">

    <button
      type="button"
      disabled={guests === 1}
      onClick={() => setGuests(guests - 1)}
    >
      -
    </button>

    <span className="guest-count">{guests}</span>

    <button
      type="button"
      disabled={guests === 4}
      onClick={() => setGuests(guests + 1)}
    >
      +
    </button>

  </div>

  <small>Maximum 4 guests</small>

</div>

            {error && (
              <p className="booking-error">{error}</p>
            )}

            <button onClick={handleBooking}
            disabled={selectedRoom.available_rooms === 0} >Book Now</button>

            <button
              className="close-btn"
              onClick={() => {
                setSelectedRoom(null);
                setGuests(1);
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
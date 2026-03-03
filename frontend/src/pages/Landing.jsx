import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();

  return (

    <div className="landing-page">

      <div className="landing-overlay">

        <div className="landing-content">

          <h1 className="landing-title">
           Marriott Hotel Booking
          </h1>

          <p className="landing-subtitle">
            Book premium rooms, manage reservations and enjoy a seamless hotel experience
          </p>

          <div className="landing-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

          </div>

          <div className="landing-features">

            <div className="feature">
              🏨 Premium Rooms
            </div>

            <div className="feature">
              📅 Easy Booking
            </div>

            <div className="feature">
              ⭐ Best Amenities
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}
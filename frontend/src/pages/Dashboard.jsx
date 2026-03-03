export default function Dashboard() {
  return (
    <>
      <h1>Welcome to Hotel Management</h1>
      <p>Manage rooms, bookings, guests and services efficiently.</p>

      <div className="service-grid">
        <div className="service-card">Room Management</div>
        <div className="service-card">Booking System</div>
        <div className="service-card">Hotel Services</div>
      </div>
    </>
  );
}
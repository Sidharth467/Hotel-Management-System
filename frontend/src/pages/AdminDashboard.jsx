export default function AdminDashboard() {
  return (
    <>
      <h1>Admin Dashboard</h1>
      <p>Overview of hotel performance.</p>

      <div className="admin-cards">
        <div className="admin-card">Total Rooms</div>
        <div className="admin-card">Active Bookings</div>
        <div className="admin-card">Revenue</div>
      </div>
    </>
  );
}
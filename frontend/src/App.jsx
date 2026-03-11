import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRooms from "./pages/AdminRooms";
import AdminBookings from "./pages/AdminBookings";
import BookingSummary from "./pages/BookingSummary";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
            <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
          <Route path="booking" element={<Booking />} />
          <Route path="my-bookings" element={<MyBookings />} />

        </Route>
        <Route
          path="/booking-summary"
          element={
            <ProtectedRoute>
              <BookingSummary />
            </ProtectedRoute>
          }
        />

      <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="rooms" element={<AdminRooms />} />
  <Route path="bookings" element={<AdminBookings />} />

</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
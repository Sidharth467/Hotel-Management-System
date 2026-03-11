import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {

  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    role: "",
    created_at: ""
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("profile/", {
      headers: { Authorization: `Bearer ${token}` }
    });
     console.log("PROFILE RESPONSE:", res.data);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {

    setLoading(true);

    await API.put(
      "profile/update/",
      {
        name: form.name,
        phone: form.phone,
        address: form.address
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setEditing(false);
    setLoading(false);
  };
console.log(">>>>>>>>>>>>>>>>>",form.email);

  return (
    <div className="profile-container">

      <div className="profile-card">

        <h2>My Profile</h2>

        <div className="profile-field">
          <label>Username</label>
          <input value={form.username} disabled />
        </div>

        <div className="profile-field">
          <label>Full Name</label>
          <input
            name="name"
            value={form.name || ""}
            disabled={!editing}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input
            name="email"
            value={form.email || ""}
            disabled />
        </div>

        <div className="profile-field">
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone || ""}
            disabled={!editing}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address || ""}
            disabled={!editing}
            onChange={handleChange}
          />
        </div>

        <div className="profile-meta">
          <span>Joined: {new Date(form.created_at).toLocaleDateString()}</span>
        </div>

        <div className="profile-actions">

          {!editing ? (
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="save-btn"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
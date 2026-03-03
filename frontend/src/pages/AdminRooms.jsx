  import { useEffect, useState } from "react";
  import API from "../services/api";

  export default function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [roomData, setRoomData] = useState({
      room_number: "",
      room_type: "single",
      price_per_night: "",
      amenities: [],
      image: null
    });
    const [amenities, setAmenities] = useState([]);
    const [editingRoomId, setEditingRoomId] = useState(null);

   const fetchAmenities = async () => {

  const res = await API.get("admin/amenities/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setAmenities(res.data);
};

const editRoom = (room) => {

  setEditingRoomId(room.id);

  setRoomData({
    room_number: room.room_number,
    room_type: room.room_type,
    price_per_night: room.price_per_night,
    amenities: room.amenities_ids || [],
    image: null
  });

};

const addAmenity = async () => {

  await API.post(
    "admin/add-amenity/",
    { name: newAmenity },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setNewAmenity("");
  fetchAmenities();
};

    const token = localStorage.getItem("access");

    useEffect(() => {
      fetchRooms();
      fetchAmenities();
    }, []);

    const fetchRooms = async () => {
      const res = await API.get("admin/rooms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    };

const saveRoom = async () => {

  const formData = new FormData();

  formData.append("room_number", roomData.room_number);
  formData.append("room_type", roomData.room_type);
  formData.append("price_per_night", roomData.price_per_night);

  roomData.amenities.forEach(id => {
    formData.append("amenities_ids[]", id);
  });

  if (roomData.image) {
    formData.append("image", roomData.image);
  }

  if (editingRoomId) {

    await API.put(
      `admin/update-room/${editingRoomId}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

  } else {

    await API.post(
      "admin/add-room/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

  }

  setEditingRoomId(null);

  setRoomData({
    room_number: "",
    room_type: "single",
    price_per_night: "",
    amenities: [],
    image: null
  });

  fetchRooms();

};

  const toggleAvailability = async (id) => {

    await API.patch(`admin/toggle-room/${id}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchRooms();
  };

    const deleteRoom = async (id) => {
      await API.delete(`admin/delete-room/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRooms();
    };

    return (
      <>
        <h2>Manage Rooms</h2>

        <div className="admin-form">
          <input
            placeholder="Room Number"
            value={roomData.room_number}
            onChange={(e) =>
              setRoomData({ ...roomData, room_number: e.target.value })
            }
          />

          {/* ✅ ROOM TYPE DROPDOWN */}
          <select
            value={roomData.room_type}
            onChange={(e) =>
              setRoomData({ ...roomData, room_type: e.target.value })
            }
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>

          <input
            placeholder="Price"
            type="number"
            value={roomData.price_per_night}
            onChange={(e) =>
              setRoomData({ ...roomData, price_per_night: e.target.value })
            }
          />
          <input
          type="file"
          onChange={(e) =>
            setRoomData({ ...roomData, image: e.target.files[0] })
    }
  />
 <div className="amenity-selector">

  {amenities.map((a) => {

    const selected = roomData.amenities.includes(a.id);

    return (
      <div
        key={a.id}
        className={`amenity-card ${selected ? "selected" : ""}`}
        onClick={() => {

          if (selected) {
            setRoomData({
              ...roomData,
              amenities: roomData.amenities.filter(id => id !== a.id)
            });
          } else {
            setRoomData({
              ...roomData,
             amenities: [...roomData.amenities, Number(a.id)]
            });
          }

        }}
      >
        {a.name}
      </div>
    );

  })}

</div>

          <button onClick={saveRoom}>
          {editingRoomId ? "Update Room" : "Add Room"}
        </button>
        </div>

        <hr />

      {rooms.map((room) => (
  <div key={room.id} className="admin-room-row">

    {room.image && (
      <img
        src={`http://127.0.0.1:8000${room.image}`}
        alt="room"
        style={{
          width: "80px",
          height: "60px",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />
    )}

    {room.room_number} | {room.room_type} | ₹{room.price_per_night}

    <span
      style={{
        marginLeft: "10px",
        color: room.is_available ? "green" : "red",
      }}
    >
      {room.is_available ? "Available" : "Unavailable"}
    </span>

    <button onClick={() => toggleAvailability(room.id)}>
      Toggle Availability
    </button>
    <button onClick={() => editRoom(room)}>
     Edit
    </button>

    <button onClick={() => deleteRoom(room.id)}>
      Delete
    </button>

  </div>
))}
      </>
    );
  }
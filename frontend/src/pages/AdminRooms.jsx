  import { useEffect, useState } from "react";
  import API from "../services/api";

  export default function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [roomData, setRoomData] = useState({
      room_number: "",
      room_type: "single",
      price_per_night: "",
      total_rooms: "",
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
const [currentImage, setCurrentImage] = useState(null);

const editRoom = (room) => {

  setEditingRoomId(room.id);
  setRoomData({
    room_number: room.room_number,
    room_type: room.room_type,
    price_per_night: room.price_per_night,
    total_rooms: room.total_rooms,
    amenities: room.amenities_ids || [],
    image: null
  });
  setCurrentImage(room.image);

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
  formData.append("total_rooms", roomData.total_rooms);
  if (roomData.image && !roomData.image.length) {
  formData.append("image", roomData.image);
}

  roomData.amenities.forEach(id => {
    formData.append("amenities_ids[]", id);
  });

if (roomData.image && roomData.image.length) {
  for (let i = 0; i < roomData.image.length; i++) {
    formData.append("images", roomData.image[i]);
  }
}

if (editingRoomId && roomData.images) {

  const imageForm = new FormData();

  for (let i = 0; i < roomData.images.length; i++) {
    imageForm.append("images", roomData.images[i]);
  }

  await API.post(
    `admin/upload-room-images/${editingRoomId}/`,
    imageForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

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
    total_rooms: "",
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
      <div className="admin-dashboard">
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
          {currentImage && (
            <img
              src={`https://hotel-management-system-boy7.onrender.com${currentImage}`}
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                marginBottom: "10px"
              }}
            />
          )}
          <input
          type="file"
          multiple
          onChange={(e) =>
            setRoomData({ ...roomData, image: e.target.files })
    }
  />
      <input
      type="number"
      placeholder="Total Rooms"
      value={roomData.total_rooms}
      onChange={(e) =>
        setRoomData({ ...roomData, total_rooms: e.target.value })
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
        src={`https://hotel-management-system-boy7.onrender.com${room.image}`}
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

<span>
  Total Rooms: {room.total_rooms}
</span>

    <span
      style={{
        marginLeft: "10px",
        color: room.is_available ? "green" : "red",
      }}
    >
      {room.is_available ? "Available" : "Unavailable"}
    </span>

   <button onClick={() => toggleAvailability(room.id)}>
  {room.is_available ? "Disable" : "Enable"}
</button>
    <button onClick={() => editRoom(room)}>
     Edit
    </button>

    <button onClick={() => deleteRoom(room.id)}>
      Delete
    </button>

  </div>
))}
</div>
      </>
    );
  }
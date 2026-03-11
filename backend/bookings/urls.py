from django.urls import path
from .views import list_available_rooms, create_booking, add_room, list_all_rooms, list_all_bookings,toggle_room_availability,list_amenities,add_amenity,delete_room,my_bookings,update_room,update_booking_status,upload_room_images,admin_dashboard
urlpatterns = [
    path("rooms/", list_available_rooms),
    path("book-room/", create_booking),
    path("admin/add-room/", add_room),
    path("admin/rooms/", list_all_rooms),
    path("admin/update-room/<int:id>/", update_room),
    path("admin/bookings/", list_all_bookings),
    path("admin/toggle-room/<int:room_id>/", toggle_room_availability),
    path("admin/amenities/", list_amenities),
    path("admin/add-amenity/", add_amenity),
    path("admin/delete-room/<int:room_id>/", delete_room),
    path("my-bookings/", my_bookings),
    path("admin/update-booking/<int:id>/", update_booking_status),
    path("admin/upload-room-images/<int:room_id>/", upload_room_images),
    path("admin/dashboard/", admin_dashboard),
]
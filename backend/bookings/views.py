from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from .serializers import RoomSerializer, BookingSerializer,AmenitySerializer
from .models import Room, Booking,Amenity
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from datetime import datetime



def admin_required(user):
    if user.role != "admin":
        raise PermissionDenied("You are not authorized to perform this action.")


@api_view(["GET"])
def list_available_rooms(request):
    rooms = Room.objects.filter(is_available=True)
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def create_booking(request):

    user = request.user
    print(request.headers)
    print("USER:", request.user)

    room_id = request.data.get("room")
    check_in = request.data.get("check_in_date")
    check_out = request.data.get("check_out_date")
    guests = int(request.data.get("guests", 1))

    room = Room.objects.get(id=room_id)

    from datetime import datetime

    if not check_in or not check_out:
        return Response({"error": "Dates are required"}, status=400)

    check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
    check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()

    nights = (check_out_date - check_in_date).days

    total_price = nights * room.price_per_night * guests

    booking = Booking.objects.create(
        user=user,
        room=room,
        check_in_date=check_in_date,
        check_out_date=check_out_date,
        guests=guests,
        total_price=total_price,
    )

    return Response({"message": "Booking successful"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bookings(request):

    bookings = Booking.objects.filter(user=request.user)

    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_room(request):

    data = request.data.copy()

    # convert amenities_ids[] → amenities_ids
    amenities = data.getlist("amenities_ids[]")

    if amenities:
        data.setlist("amenities_ids", amenities)

    serializer = RoomSerializer(data=data)

    if serializer.is_valid():

        room = serializer.save()

        return Response(serializer.data)

    return Response(serializer.errors, status=400)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def toggle_room_availability(request, room_id):

    # optional: ensure only admin can do this
    if request.user.role.lower() != "admin":
        return Response(
            {"error": "Only admin can update room availability"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    room.is_available = not room.is_available
    room.save()

    return Response(
        {
            "message": "Availability updated",
            "is_available": room.is_available
        },
        status=status.HTTP_200_OK
    )

#for admin
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_all_rooms(request):
    admin_required(request.user)

    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def list_amenities(request):

    amenities = Amenity.objects.all()
    serializer = AmenitySerializer(amenities, many=True)

    return Response(serializer.data)

@api_view(["POST"])
def add_amenity(request):

    serializer = AmenitySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)

#for admin

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_all_bookings(request):
    admin_required(request.user)

    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)




@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_room(request, id):

    try:
        room = Room.objects.get(id=id)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    serializer = RoomSerializer(room, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_room(request, room_id):
    admin_required(request.user)

    room = get_object_or_404(Room, id=room_id)
    room.delete()

    return Response({"message": "Room deleted successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_all_bookings(request):
    admin_required(request.user)

    bookings = Booking.objects.all().order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_booking(request, booking_id):
    admin_required(request.user)

    booking = get_object_or_404(Booking, id=booking_id)
    serializer = BookingSerializer(booking, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_booking_status(request, id):

    try:
        booking = Booking.objects.get(id=id)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    status_value = request.data.get("status")

    if status_value not in ["booked", "completed", "cancelled"]:
        return Response({"error": "Invalid status"}, status=400)

    booking.status = status_value
    booking.save()

    return Response({"message": "Booking updated"})
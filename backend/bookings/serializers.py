from rest_framework import serializers
from .models import Room, Booking,Amenity


class RoomSerializer(serializers.ModelSerializer):

    amenities = serializers.StringRelatedField(many=True, read_only=True)

    amenities_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Amenity.objects.all(),
        write_only=True
    )

    class Meta:
        model = Room
        fields = [
            "id",
            "room_number",
            "room_type",
            "price_per_night",
            "description",
            "image",
            "is_available",
            "amenities",
            "amenities_ids"
        ]

    def create(self, validated_data):

        amenities = validated_data.pop("amenities_ids", [])

        room = Room.objects.create(**validated_data)

        room.amenities.set(amenities)

        return room


class BookingSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["user", "total_price", "status"]


class AmenitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Amenity
        fields = "__all__"
from rest_framework import serializers
from .models import Room, Booking,Amenity,RoomImage



class RoomImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoomImage
        fields = ["image"]


class RoomSerializer(serializers.ModelSerializer):

    amenities = serializers.StringRelatedField(many=True, read_only=True)
    images = RoomImageSerializer(many=True, read_only=True)

    amenities_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Amenity.objects.all(),
        source="amenities"
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
            "amenities_ids",
            "total_rooms"
        ]

    def create(self, validated_data):

        amenities = validated_data.pop("amenities_ids", [])

        room = Room.objects.create(**validated_data)

        room.amenities.set(amenities)

        return room
    
    def update(self, instance, validated_data):

        amenities = validated_data.pop("amenities", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if amenities is not None:
            instance.amenities.set(amenities)

        return instance


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


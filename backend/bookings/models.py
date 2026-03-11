from django.db import models
from django.conf import settings


class Amenity(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    
class Room(models.Model):
    ROOM_TYPES = (
        ('single', 'Single'),
        ('double', 'Double'),
        ('suite', 'Suite'),
    )

    room_number = models.CharField(max_length=10, unique=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    total_rooms = models.IntegerField(default=1) 
    is_available = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    amenities = models.ManyToManyField(Amenity, blank=True)
    image = models.ImageField(upload_to="rooms/", null=True, blank=True)

    def __str__(self):
        return self.room_number
    

class Booking(models.Model):
    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    guests = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.room.room_number}"
    

class RoomImage(models.Model):

    room = models.ForeignKey(
        Room,
        related_name="images",
        on_delete=models.CASCADE
    )

    image = models.ImageField(upload_to="rooms/")
    

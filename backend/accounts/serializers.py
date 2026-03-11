from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','username', 'email', 'password', 'phone', 'address']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "username",
            "name",
            "email",
            "phone",
            "address",
            "role",
            "created_at"
        ]
        read_only_fields = ["username", "role", "created_at"]
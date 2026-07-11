from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.food_name', read_only=True)
    price = serializers.DecimalField(source='food.price', max_digits=8, decimal_places=2, read_only=True)
    image = serializers.ImageField(source='food.image', read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'food', 'food_name', 'price', 'image', 'quantity']
from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.food_name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total', 'payment_status', 'order_status', 'items', 'created_at']
        read_only_fields = ['user', 'total', 'payment_status', 'order_status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        total = sum(item['price'] * item['quantity'] for item in items_data)
        order = Order.objects.create(
            user=self.context['request'].user,
            total=total
        )
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        return order
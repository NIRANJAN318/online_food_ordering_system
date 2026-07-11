from django.db import models
from django.conf import settings
from menu.models import Food

class Order(models.Model):
    PAYMENT_STATUS = (('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'))
    ORDER_STATUS = (
        ('pending', 'Pending'), ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'), ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'), ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)
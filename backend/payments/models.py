from django.db import models
from orders.models import Order

class Payment(models.Model):
    METHOD_CHOICES = (('cod', 'Cash on Delivery'), ('upi', 'UPI'), ('card', 'Card'))
    order = models.OneToOneField(Order, related_name='payment', on_delete=models.CASCADE)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    is_successful = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
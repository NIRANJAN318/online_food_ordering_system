from django.db import models

class Restaurant(models.Model):
    restaurant_name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='restaurants/', blank=True, null=True)
    address = models.CharField(max_length=300)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    delivery_time = models.CharField(max_length=50, blank=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.restaurant_name
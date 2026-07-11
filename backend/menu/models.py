from django.db import models
from restaurants.models import Restaurant

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Food(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='foods', on_delete=models.CASCADE)
    category = models.ForeignKey(Category, related_name='foods', on_delete=models.SET_NULL, null=True)
    food_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='foods/', blank=True, null=True)
    availability = models.BooleanField(default=True)

    def __str__(self):
        return self.food_name
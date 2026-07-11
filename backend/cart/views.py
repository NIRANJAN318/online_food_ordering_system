from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Cart
from .serializers import CartSerializer

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return the logged-in user's own cart items
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically attach the logged-in user when adding to cart
        serializer.save(user=self.request.user)
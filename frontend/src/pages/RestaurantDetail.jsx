import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`restaurants/${id}/`),
      api.get(`menu/foods/`)
    ])
      .then(([restaurantRes, foodsRes]) => {
        setRestaurant(restaurantRes.data);
        // Filter foods belonging to this restaurant
        const filtered = foodsRes.data.filter((f) => f.restaurant === parseInt(id));
        setFoods(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load restaurant details');
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  const addToCart = async (foodId) => {
    try {
      await api.post('cart/', { food: foodId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert('Please login to add items to cart');
      console.error(err);
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold">{restaurant.restaurant_name}</h2>
        <p className="text-gray-600">{restaurant.address}</p>
        <p className="text-sm mt-1">⭐ {restaurant.rating} · {restaurant.delivery_time}</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Menu</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.length === 0 ? (
          <p>No food items available for this restaurant yet.</p>
        ) : (
          foods.map((food) => (
            <div key={food.id} className="border rounded-lg shadow p-4">
              <h4 className="text-lg font-semibold">{food.food_name}</h4>
              <p className="text-gray-600 text-sm">{food.description}</p>
              <p className="font-bold mt-2">₹{food.price}</p>
              <button
                onClick={() => addToCart(food.id)}
                className="mt-3 bg-primary text-white px-4 py-2 rounded hover:opacity-90 w-full"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
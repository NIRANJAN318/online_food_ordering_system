import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('restaurants/')
      .then((res) => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load restaurants');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.restaurant_name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center p-8">Loading restaurants...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Popular Restaurants</h2>

      <input
        type="text"
        placeholder="Search restaurants by name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded w-full max-w-md mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRestaurants.length === 0 ? (
          <p>No restaurants match your search.</p>
        ) : (
          filteredRestaurants.map((r) => (
            <Link
              to={`/restaurant/${r.id}`}
              key={r.id}
              className="border rounded-lg shadow p-4 hover:shadow-lg transition block"
            >
              <h3 className="text-xl font-semibold">{r.restaurant_name}</h3>
              <p className="text-gray-600">{r.address}</p>
              <p className="text-sm mt-2">⭐ {r.rating} · {r.delivery_time}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
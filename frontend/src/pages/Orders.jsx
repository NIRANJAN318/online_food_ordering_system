import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('orders/')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders. Please login first.');
        setLoading(false);
      });
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-500';
      case 'pending': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) return <p className="text-center p-8">Loading orders...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Order #{order.id}</h3>
                <span className={`font-medium ${statusColor(order.order_status)}`}>
                  {order.order_status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
              <div className="border-t pt-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.food_name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Payment: {order.payment_status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
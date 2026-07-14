import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = () => {
    api.get('cart/')
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load cart. Please login first.');
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.patch(`cart/${itemId}/`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`cart/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryCharge = cartItems.length > 0 ? 30 : 0;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryCharge + gst;

  if (loading) return <p className="text-center p-8">Loading cart...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. Go add something tasty!</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
                <div>
                  <h3 className="font-semibold">{item.food_name}</h3>
                  <p className="text-gray-600 text-sm">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-3 py-1 rounded font-bold"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-3 py-1 rounded font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 ml-4 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex flex-col gap-2 text-right">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
            <p>GST (5%): ₹{gst.toFixed(2)}</p>
            <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-4 bg-primary text-white py-3 rounded font-semibold hover:opacity-90"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
} 
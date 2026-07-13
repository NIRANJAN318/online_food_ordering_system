import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('cart/')
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load cart');
        setLoading(false);
      });
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryCharge = cartItems.length > 0 ? 30 : 0;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryCharge + gst;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      setError('Please fill in delivery address and phone number');
      return;
    }
    setPlacing(true);
    setError('');

    try {
      // Step 1: Create the order with all cart items
      const orderPayload = {
        items: cartItems.map((item) => ({
          food: item.food,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      const orderRes = await api.post('orders/', orderPayload);
      const orderId = orderRes.data.id;

      // Step 2: Create the payment record
      await api.post('payments/', {
        order: orderId,
        method: paymentMethod,
      });

      // Step 3: Clear the cart (delete each item)
      await Promise.all(cartItems.map((item) => api.delete(`cart/${item.id}/`)));

      // Step 4: Redirect to order history
      navigate('/orders');
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading checkout...</p>;

  if (cartItems.length === 0) {
    return <p className="text-center p-8">Your cart is empty. Add items before checking out.</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Delivery Details</h3>
          <div className="flex flex-col gap-3">
            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 rounded"
              rows={3}
              required
            />
            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Payment Method</h3>
          <div className="flex flex-col gap-2">
            {[
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'upi', label: 'UPI' },
              { value: 'card', label: 'Card' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex flex-col gap-1 text-right">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
          <p>GST (5%): ₹{gst.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="bg-primary text-white py-3 rounded font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {placing ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
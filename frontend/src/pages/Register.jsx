import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    username: '', name: '', email: '', phone: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('accounts/register/', form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="username" placeholder="Username" onChange={handleChange} required className="border p-2 rounded" />
        <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border p-2 rounded" />
        <input name="confirm_password" type="password" placeholder="Confirm Password" onChange={handleChange} required className="border p-2 rounded" />
        <button type="submit" className="bg-primary text-white py-2 rounded font-semibold hover:opacity-90">
          Register
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link>
      </p>
    </div>
  );
}
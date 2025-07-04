import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const NewsletterSignup: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/newsletter/subscribe`,
        { email: email.trim() }
      );

      showToast(response.data.message, 'success');
      setEmail(''); // Clear the input on success
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      const message = err.response?.data?.message || 'Failed to subscribe to newsletter';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        disabled={loading}
        className="flex-1 px-6 py-4 bg-white border-2 border-teal-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all duration-500 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        type="submit"
        disabled={loading}
        className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold tracking-wider uppercase hover:from-teal-600 hover:to-teal-700 transition-all duration-500 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

export default NewsletterSignup;
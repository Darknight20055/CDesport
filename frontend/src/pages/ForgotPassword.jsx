import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ A password reset email has been sent.');
      } else {
        setMessage('❌ ' + (data.error || 'Server error.'));
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setMessage('❌ Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Forgot Password</h1>
      <form onSubmit={handleForgot} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Your email"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-cyan-600 hover:bg-cyan-700 rounded font-bold transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {message && (
        <p className="mt-6 text-center text-cyan-300 font-semibold">{message}</p>
      )}
    </div>
  );
}

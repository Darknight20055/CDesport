import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPasswordCode() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email || !code || !newPassword || !confirmPassword) {
      return setMessage('❌ All fields are required.');
    }

    if (newPassword !== confirmPassword) {
      return setMessage('❌ Passwords do not match.');
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/reset-password-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password: newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage('✅ Password reset successfully.');
      } else {
        setMessage('❌ ' + (data.error || 'Something went wrong.'));
      }
    } catch (err) {
      console.error('Reset code error:', err);
      setLoading(false);
      setMessage('❌ Network error.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Reset with Code</h1>
      <form onSubmit={handleReset} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Your email"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Code received by email"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 rounded font-bold transition"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && (
        <p className="mt-6 text-center text-cyan-300 font-semibold">{message}</p>
      )}
    </div>
  );
}

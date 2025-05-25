import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    console.log("🔑 token reçu dans useParams:", token);
    if (!token) {
      setIsValidToken(false);
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return setMessage('❌ All fields are required.');
    }
    if (newPassword !== confirmPassword) {
      return setMessage('❌ Passwords do not match.');
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }), // ✅ clé correcte
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage('✅ Password updated! Redirecting...');
        setTimeout(() => {
          navigate('/reset-success');
        }, 2000);
      } else {
        setMessage('❌ ' + (data.error || 'Error resetting password.'));
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setLoading(false);
      setMessage('❌ Network error.');
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">❌ Invalid or expired reset link.</h1>
          <p className="text-gray-400">
            Please request a new one from the{' '}
            <a href="/forgot-password" className="text-cyan-400 underline">
              Forgot Password
            </a>{' '}
            page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Reset Your Password</h1>
      <form onSubmit={handleReset} className="space-y-4 w-80">
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-cyan-400"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-cyan-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 rounded font-bold transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && (
        <p className="mt-6 text-center text-cyan-300 font-semibold">{message}</p>
      )}
    </div>
  );
}

import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setMessage('📩 Code sent to your email.');
      } else {
        setMessage(data.message || '❌ Error sending code.');
      }
    } catch (err) {
      setMessage('❌ Server error.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage('❌ Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Password reset successfully.');
      } else {
        setMessage(data.message || '❌ Reset failed.');
      }
    } catch (err) {
      setMessage('❌ Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>

      {step === 1 && (
        <form onSubmit={handleSendCode} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Enter the code received"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {message && <p className="mt-6 text-sm text-center text-gray-300">{message}</p>}
    </div>
  );
}

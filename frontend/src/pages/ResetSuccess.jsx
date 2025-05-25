import React from 'react';
import { Link } from 'react-router-dom';

export default function ResetSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">
        ✅ Password reset successfully!
      </h1>
      <p className="mb-8 text-center">
        You can now log in with your new password.
      </p>
      <Link
        to="/login"
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        Back to Login
      </Link>
    </div>
  );
}

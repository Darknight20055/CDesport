import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login, register, resendVerificationEmail } from "../services/auth";

export default function AuthForm({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("confirmed") === "true") {
      setMessage("✅ Your email has been confirmed. You can now log in.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setShowResend(false);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isLogin) {
        const data = await login(cleanEmail, password);

        if (!data.token) {
          throw new Error("Missing token after login.");
        }

        localStorage.setItem("token", data.token);
        if (setIsAuthenticated) setIsAuthenticated(true);
        navigate("/"); // ✅ redirection vers Home
      } else {
        await register(pseudo, cleanEmail, password);
        localStorage.setItem("pendingEmail", cleanEmail);
        navigate("/confirm-code");
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage = err.response?.data?.error || err.message || "An error occurred.";
      setError(errorMessage);

      if (errorMessage.includes("confirm your email")) {
        setShowResend(true);
      }
    }
  };

  const handleResend = async () => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      await resendVerificationEmail(cleanEmail);
      localStorage.setItem("pendingEmail", cleanEmail);
      setMessage("✅ A new confirmation email has been sent.");
      setError("");
      setShowResend(false);
      navigate("/confirm-code");
    } catch (err) {
      console.error("Resend error:", err);
      setError("❌ Failed to send verification email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          {isLogin ? "Login" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full ${
              isLogin
                ? "bg-cyan-600 hover:bg-cyan-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-bold py-3 rounded transition`}
          >
            {isLogin ? "Log in" : "Sign up"}
          </button>

          {isLogin && (
            <div className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </form>

        {error && (
          <p className="mt-4 text-center text-red-400 font-semibold">{error}</p>
        )}
        {message && (
          <p className="mt-4 text-center text-green-400 font-semibold">
            {message}
          </p>
        )}

        {showResend && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleResend}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Resend verification email
            </button>
          </div>
        )}

        <div className="text-center mt-6 text-gray-400 text-sm">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link to="/signup" className="text-cyan-400 hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

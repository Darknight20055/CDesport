import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailCode } from "../services/auth";

export default function ConfirmCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (!storedEmail) {
      navigate("/signup");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await verifyEmailCode(email, code); // appel vers ton backend
      if (res.success) {
        setMessage("✅ Code vérifié avec succès. Vous pouvez maintenant vous connecter.");
        localStorage.removeItem("pendingEmail");
        setTimeout(() => navigate("/login?confirmed=true"), 1000);
      } else {
        setError(res.message || "❌ Code invalide.");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center text-cyan-400 mb-6">
        Confirmer votre courriel
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          placeholder="Entrez le code reçu par courriel"
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded"
        >
          Confirmer le code
        </button>
      </form>

      {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
    </div>
  );
}

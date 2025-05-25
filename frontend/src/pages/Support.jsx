import { useState } from "react";

export default function Support() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setSent(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white rounded-xl shadow-lg mt-24">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">
        Contact Support 📞
      </h1>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            className="w-full bg-gray-800 text-white border border-cyan-600 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            rows={6}
            placeholder="Describe your issue or question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
          >
            Send Message
          </button>
        </form>
      ) : (
        <div className="text-center text-green-400 font-semibold text-lg">
          ✅ Your message has been sent to support!
        </div>
      )}
    </div>
  );
}

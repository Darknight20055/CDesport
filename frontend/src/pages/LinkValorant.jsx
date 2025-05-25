import { useState } from "react";

export default function LinkValorant() {
  const [riotId, setRiotId] = useState("");
  const [linked, setLinked] = useState(false);
  const [error, setError] = useState("");

  const simulateAccountCreationDate = () => {
    const now = new Date();
    const fakeAgeInDays = Math.floor(Math.random() * 180);
    const creationDate = new Date(now);
    creationDate.setDate(now.getDate() - fakeAgeInDays);
    return creationDate;
  };

  const isAtLeast3MonthsOld = (creationDate) => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    return creationDate <= threeMonthsAgo;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!riotId.includes("#")) {
      setError("❌ Invalid Riot ID format. Example: Charly#NA1");
      return;
    }

    const fakeCreatedAt = simulateAccountCreationDate();

    if (!isAtLeast3MonthsOld(fakeCreatedAt)) {
      setError("❌ Your Riot account must be at least 3 months old to participate.");
      return;
    }

    setLinked(true);
    console.log("Account linked:", riotId, "(created on " + fakeCreatedAt.toLocaleDateString() + ")");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-32">
      <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-cyan-400 text-center mb-8">
          Link My Valorant Account
        </h1>

        {!linked ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Riot ID (e.g., Charly#NA1)"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-cyan-400"
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 w-full rounded font-bold transition transform hover:scale-105"
            >
              Link My Account
            </button>
          </form>
        ) : (
          <div className="text-center text-green-400 font-medium">
            ✅ Account successfully linked: <br />
            <span className="font-bold">{riotId}</span>
          </div>
        )}
      </div>
    </div>
  );
}

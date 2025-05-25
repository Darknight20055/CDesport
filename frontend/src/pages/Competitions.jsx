import { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/api";

const API_URL = process.env.REACT_APP_API_URL;

export default function Competitions() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [riotLinked, setRiotLinked] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [started, setStarted] = useState(false);
  const [tournamentEnded, setTournamentEnded] = useState(false);
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(null);
  const isAuthenticated = !!localStorage.getItem("token");
  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const getNextSunday18h = () => {
    const now = new Date();
    const result = new Date();
    result.setDate(now.getDate() + ((7 - now.getDay()) % 7));
    result.setHours(18, 0, 0, 0);
    return result;
  };

  const getRankColor = (index) => {
    if (index === 0) return "text-yellow-400"; // 🥇
    if (index === 1) return "text-gray-300";   // 🥈
    if (index === 2) return "text-orange-400"; // 🥉
    return "text-white";
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await fetchUserProfile(token);
          setUser(userData);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    const loadTournaments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tournaments/list`);
        const data = await res.json();
        setTournaments(data);
      } catch (err) {
        console.error("Erreur de chargement des tournois :", err);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/valorant/scores/weekly`);
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error("Erreur de leaderboard :", err);
      }
    };

    loadUser();
    loadTournaments();
    fetchLeaderboard();

    const target = getNextSunday18h();
    const now = new Date();
    const savedLastReset = localStorage.getItem("lastReset");
    const lastReset = savedLastReset ? new Date(savedLastReset) : null;

    if (!lastReset || (lastReset < target && now > target)) {
      localStorage.setItem("players", JSON.stringify([]));
      setPlayers([]);
      localStorage.setItem("lastReset", now.toISOString());
      localStorage.removeItem("rankingUpdated");
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0 && diff > -1000 * 60 * 60 * 24) {
        setStarted(true);
        setTimeLeft("\ud83c\udf19 Tournament in progress!");
      }

      if (diff <= -1000 * 60 * 60) {
        setTournamentEnded(true);
        setTimeLeft("\u2705 Tournament ended");
      }

      if (diff > 0) {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = () => {
    if (!riotLinked) return alert("\u274c You must link your Valorant account to participate.");
    if (!user) return alert("\u274c You must be logged in to register.");

    const pseudo = user.pseudo;
    if (players.includes(pseudo)) return alert("\u274c You are already registered for this tournament.");

    const updated = [...players, pseudo];
    setPlayers(updated);
    localStorage.setItem("players", JSON.stringify(updated));
    setIsRegistered(true);
  };

  return (
    <div className="min-h-screen pt-24 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <p className="text-lg">
            ⏳ <span className="text-yellow-400 font-bold text-xl">{timeLeft}</span>
          </p>
          <p className="text-gray-300 mt-2">
            📅 <span className="text-cyan-400">Every Sunday at 6:00 PM</span> – 💸 <span className="text-green-400">Free</span> – 🧩 Combat Score only – 🏆 Top 3 = trophies
          </p>
          {isAuthenticated && isRegistered && (
            <p className="mt-4 text-green-500 font-semibold">✅ You are registered for this tournament.</p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-center text-cyan-400 mb-4">📅 Upcoming Tournaments</h2>
          {tournaments.length === 0 ? (
            <p className="text-gray-400 text-center">No tournaments available.</p>
          ) : (
            <ul className="space-y-3">
              {tournaments.map((tournament) => (
                <li key={tournament._id} className="bg-gray-700 p-4 rounded">
                  <div className="font-bold text-lg">{tournament.name}</div>
                  <div className="text-sm text-gray-300">
                    💰 Cash Prize: ${tournament.cashPrize} <br />
                    📅 Date: {new Date(tournament.date).toLocaleDateString()} <br />
                    👥 Max participants: {tournament.maxParticipants}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold text-center text-yellow-400 mb-4">🏆 Leaderboard – Top Players</h2>
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-400">No data yet. Matches are being analyzed.</p>
          ) : (
            <table className="w-full min-w-[600px] text-white table-auto border-collapse">
              <thead>
                <tr className="bg-gray-700 text-cyan-400 text-left">
                  <th className="p-3 border-b border-gray-600">#</th>
                  <th className="p-3 border-b border-gray-600">Riot Name</th>
                  <th className="p-3 border-b border-gray-600">Combat Score</th>
                  <th className="p-3 border-b border-gray-600">Matches</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition">
                    <td className="p-3 border-b border-gray-600">{index + 1}</td>
                    <td className={`p-3 border-b border-gray-600 font-semibold ${getRankColor(index)}`}>{player.riotName}</td>
                    <td className="p-3 border-b border-gray-600">{player.totalScore}</td>
                    <td className="p-3 border-b border-gray-600">{player.matchCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
          <h2 className="text-lg font-bold mb-2 text-center text-cyan-400">👥 Registered Participants</h2>
          <ul className="list-disc list-inside text-gray-300">
            {players.map((p, i) => (
              <li key={i} className="py-1">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

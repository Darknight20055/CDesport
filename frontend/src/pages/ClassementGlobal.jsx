import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClassementGlobal() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ranking/top`);
        setTopPlayers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching global ranking:', error);
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  const getGlowClass = (index) => {
    if (index === 0) return 'glow-gold';
    if (index === 1) return 'glow-silver';
    if (index === 2) return 'glow-bronze';
    return '';
  };

  if (loading) return <div className="text-white text-center mt-10">Loading ranking...</div>;

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-red-500 mb-8 flex items-center gap-2">
        🏆 Global Ranking
      </h1>

      <div className="bg-[#111827] rounded-xl shadow-md p-8 w-full max-w-4xl">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#1f2937] text-blue-400">
              <th className="py-3">#</th>
              <th className="py-3">Avatar</th>
              <th className="py-3">Username</th>
              <th className="py-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, index) => (
              player.userId && (
                <tr
                  key={player._id}
                  className={`border-b border-gray-700 hover:bg-[#1f2937] transition duration-300 ease-in-out ${getGlowClass(index)}`}
                >
                  <td className="py-3 text-lg">{getMedal(index)}</td>
                  <td className="py-3 relative">
                    {index === 0 && (
                      <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 animate-bounce text-yellow-400 text-2xl">
                        👑
                      </div>
                    )}
                    <img
                      src={player.userId.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="py-3 font-semibold text-white">{player.userId.pseudo}</td>
                  <td className="py-3 font-bold text-red-400">{player.points}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Back to home button */}
      <div className="mt-10">
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default ClassementGlobal;

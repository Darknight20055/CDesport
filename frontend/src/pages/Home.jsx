export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center px-4">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6 drop-shadow">
        Welcome to CDesport 🎮
      </h1>
      <p className="text-lg text-gray-300 max-w-xl">
        Join <span className="text-red-500 font-semibold">free</span> or <span className="text-yellow-400 font-semibold">cash prize</span> Valorant tournaments.
        Compete solo or in teams, climb the <span className="text-cyan-400 font-semibold">leaderboard</span>, and earn rewards!
      </p>
    </div>
  );
}

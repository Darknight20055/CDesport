export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 pt-16 pb-32 space-y-16 overflow-hidden">
      
      {/* 🎨 Néon rouge et bleu en arrière-plan */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-600 opacity-20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600 opacity-20 blur-3xl rounded-full animate-pulse-slow" />
      </div>

      {/* 🔥 Logo + slogan */}
      <div className="text-center">
        <img
          src="/logo-cdesport.png"
          alt="CDesport Logo"
          className="w-40 md:w-48 mx-auto mb-4 drop-shadow-[0_0_25px_rgba(255,0,0,0.6)]"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
          Welcome to CDesport.
        </h1>
        <p className="text-lg text-gray-300">
          The arena for real Valorant competitors.
        </p>
      </div>

      {/* 🏆 Bloc Weekly Tournaments */}
      <div className="bg-[#111827] rounded-2xl border border-red-500 p-6 w-full max-w-md shadow-lg text-center">
        <img
          src="/tournament-placeholder.jpg"
          alt="Tournament Banner"
          className="w-full rounded-xl mb-4"
        />
        <h2 className="text-xl font-bold text-white mb-2">WEEKLY TOURNAMENTS</h2>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full">
          JOIN
        </button>
        <p className="text-sm mt-3 text-gray-400">Compete in tournaments every week.</p>
      </div>

      {/* 🧠 Bloc Leaderboard */}
      <div className="bg-[#111827] rounded-2xl border border-blue-500 p-6 w-full max-w-md shadow-lg text-center">
        <img
          src="/leaderboard-placeholder.jpg"
          alt="Leaderboard"
          className="w-full rounded-xl mb-4"
        />
        <h2 className="text-xl font-bold text-white mb-2">LEADERBOARD</h2>
        <p className="text-sm text-gray-400">
          Climb the leaderboard.<br /> Earn your respect.
        </p>
      </div>
    </div>
  );
}

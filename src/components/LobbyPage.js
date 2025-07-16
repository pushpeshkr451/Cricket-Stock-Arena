import React from "react";
import { Coins, LogOut } from "lucide-react";

const LobbyPage = ({
  setPage,
  setShowComingSoon,
  handleLogout,
  currentUser,
}) => {
  const games = [
    { name: "Cricket Stock", key: "cricket", available: true },
    { name: "Football Frenzy", key: "football", available: false },
    { name: "Basket Bets", key: "basketball", available: false },
    { name: "eSports Arena", key: "esports", available: false },
  ];

  return (
    <div className="p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {currentUser.username || "Player"}!
          </h1>
          <div className="flex items-center space-x-4 text-yellow-400 mt-2">
            <Coins size={24} />
            <span className="text-2xl font-semibold">
              {currentUser.coins?.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-6">Choose Your Game</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.key}
              onClick={() =>
                game.available ? setPage("game") : setShowComingSoon(true)
              }
              className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${
                game.available
                  ? "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                  : "bg-gray-700 opacity-60"
              }`}
            >
              <h3 className="text-2xl font-bold">{game.name}</h3>
              {!game.available && (
                <p className="mt-2 text-sm bg-yellow-500 text-black font-bold px-2 py-1 rounded-md inline-block">
                  Coming Soon
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LobbyPage;

import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import usePrevious from "../hooks/usePrevious";

const TeamCard = ({
  team,
  price,
  shares,
  onTransaction,
  teamKey,
  isBatting,
}) => {
  const [buySellAmount, setBuySellAmount] = useState(1);
  const lastPrice = usePrevious(price);
  const priceChange = price - (lastPrice || price);

  return (
    <div
      className={`bg-gray-800 p-6 rounded-xl shadow-lg border-2 ${
        isBatting ? "border-yellow-400" : "border-transparent"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold" style={{ color: team.color }}>
          {team.name}
        </h3>
        <div
          className={`flex items-center font-semibold text-lg ${
            priceChange >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {priceChange > 0 ? (
            <TrendingUp size={20} />
          ) : priceChange < 0 ? (
            <TrendingDown size={20} />
          ) : null}
          <span className="ml-1">{price.toFixed(2)}</span>
        </div>
      </div>
      {isBatting && (
        <div className="text-xs font-bold text-yellow-400 mb-2 animate-pulse">
          BATTING
        </div>
      )}
      <p className="text-gray-400 mb-4">
        Your Shares: <span className="font-bold text-white">{shares || 0}</span>
      </p>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="number"
          min="1"
          value={buySellAmount}
          onChange={(e) => setBuySellAmount(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onTransaction("buy", teamKey, buySellAmount)}
          className="w-full py-2 px-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Buy
        </button>
        <button
          onClick={() => onTransaction("sell", teamKey, buySellAmount)}
          className="w-full py-2 px-4 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TeamCard;

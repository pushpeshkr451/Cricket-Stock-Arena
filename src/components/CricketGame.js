import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  BarChart2,
  Coins,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TeamCard from "./TeamCard";
import { GameInstructionsModal } from "./ui/Modals";

const CricketGame = ({
  currentUser,
  updateUserData,
  setPage,
  showNotification,
}) => {
  const TEAMS = useMemo(
    () => ({
      A: { name: "Blue Strikers", color: "#3b82f6" },
      B: { name: "Red Challengers", color: "#ef4444" },
    }),
    []
  );

  const INITIAL_PRICE = 50;
  const TOTAL_BALLS = 40;
  const INNINGS_BREAK = 20;

  const [stockPrices, setStockPrices] = useState({
    teamA: INITIAL_PRICE,
    teamB: INITIAL_PRICE,
  });
  const [priceHistory, setPriceHistory] = useState([
    { event: 0, teamA: INITIAL_PRICE, teamB: INITIAL_PRICE },
  ]);
  const [eventLog, setEventLog] = useState([]);
  const [gameState, setGameState] = useState("instructions"); // 'instructions', 'playing', 'innings_break', 'finished'

  const [currentBall, setCurrentBall] = useState(0);
  const [battingTeamKey, setBattingTeamKey] = useState("teamA");

  const [showInstructions, setShowInstructions] = useState(true);

  // New state for selected team to bet on
  const [selectedTeamKey, setSelectedTeamKey] = useState(null);

  // Game Logic
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameInterval = setInterval(() => {
      setCurrentBall((prevBall) => {
        const nextBall = prevBall + 1;

        // --- Event Logic ---
        const events = ["single", "double", "triple", "four", "six", "wicket"];
        const randomEvent = events[Math.floor(Math.random() * events.length)];

        const bowlingTeamKey = battingTeamKey === "teamA" ? "teamB" : "teamA";

        setStockPrices((prevPrices) => {
          let newPrices = { ...prevPrices };
          let logMessage = "";

          const battingTeamName =
            battingTeamKey === "teamA" ? TEAMS.A.name : TEAMS.B.name;
          const bowlingTeamName =
            bowlingTeamKey === "teamA" ? TEAMS.A.name : TEAMS.B.name;

          switch (randomEvent) {
            case "four":
              newPrices[battingTeamKey] += 2;
              newPrices[bowlingTeamKey] -= 2;
              logMessage = `FOUR! by ${battingTeamName}. Their stock is up!`;
              break;
            case "six":
              newPrices[battingTeamKey] += 4;
              newPrices[bowlingTeamKey] -= 4;
              logMessage = `SIX! Huge hit by ${battingTeamName}. Stock soaring!`;
              break;
            case "wicket":
              newPrices[battingTeamKey] -= 5;
              newPrices[bowlingTeamKey] += 5;
              logMessage = `WICKET! ${bowlingTeamKey} strikes! ${battingTeamName}'s stock drops.`;
              break;
            default:
              logMessage = `${
                randomEvent.charAt(0).toUpperCase() + randomEvent.slice(1)
              } run. Prices stable.`;
              break;
          }

          newPrices.teamA = Math.max(10, newPrices.teamA);
          newPrices.teamB = Math.max(10, newPrices.teamB);

          setEventLog((prevLog) => [
            `Ball ${nextBall}: ${logMessage}`,
            ...prevLog.slice(0, 99),
          ]);
          setPriceHistory((prevHistory) => [
            ...prevHistory,
            { event: nextBall, teamA: newPrices.teamA, teamB: newPrices.teamB },
          ]);
          return newPrices;
        });

        // --- Game State Transitions ---
        if (nextBall === INNINGS_BREAK) {
          setGameState("innings_break");
          setEventLog((prev) => [
            `Innings Break! ${
              bowlingTeamKey === "teamA" ? TEAMS.A.name : TEAMS.B.name
            } to bat next.`,
            ...prev,
          ]);
          setTimeout(() => {
            setBattingTeamKey(bowlingTeamKey);
            setGameState("playing");
          }, 5000); // 5 second break
        } else if (nextBall === TOTAL_BALLS) {
          setGameState("finished");
          const winner =
            stockPrices.teamA > stockPrices.teamB ? TEAMS.A.name : TEAMS.B.name;
          if (stockPrices.teamA === stockPrices.teamB) {
            setEventLog((prev) => [`Match Drawn!`, `MATCH ENDED!`, ...prev]);
          } else {
            setEventLog((prev) => [
              `${winner} win the match!`,
              `MATCH ENDED!`,
              ...prev,
            ]);
          }
        }

        return nextBall;
      });
    }, 3000);

    return () => clearInterval(gameInterval);
  }, [gameState, battingTeamKey, TEAMS]);

  const handleTransaction = (type, team, amountStr) => {
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      showNotification("Please enter a valid amount.", "error");
      return;
    }

    // Check if the selected team is set and matches the transaction team
    if (selectedTeamKey && team !== selectedTeamKey) {
      showNotification(
        `You can only trade shares of the selected team: ${
          TEAMS[selectedTeamKey === "teamA" ? "A" : "B"].name
        }`,
        "error"
      );
      return;
    }

    const stockPrice = team === "teamA" ? stockPrices.teamA : stockPrices.teamB;
    const cost = stockPrice * amount;

    const currentCoins = currentUser.coins;
    const currentStocks = currentUser.stocks;

    if (type === "buy") {
      if (currentCoins < cost) {
        showNotification("Insufficient coins!", "error");
        return;
      }
      const newCoins = currentCoins - cost;
      const newStocks = {
        ...currentStocks,
        [team]: (currentStocks[team] || 0) + amount,
      };
      updateUserData({ coins: newCoins, stocks: newStocks });
      showNotification(
        `Successfully bought ${amount} shares of ${
          team === "teamA" ? TEAMS.A.name : TEAMS.B.name
        }`,
        "success"
      );
    } else {
      // sell
      if ((currentStocks[team] || 0) < amount) {
        showNotification("Not enough shares to sell!", "error");
        return;
      }
      const newCoins = currentCoins + cost;
      const newStocks = {
        ...currentStocks,
        [team]: currentStocks[team] - amount,
      };
      updateUserData({ coins: newCoins, stocks: newStocks });
      showNotification(
        `Successfully sold ${amount} shares of ${
          team === "teamA" ? TEAMS.A.name : TEAMS.B.name
        }`,
        "success"
      );
    }
  };

  const startGame = () => {
    setShowInstructions(false);
    setEventLog([`Match Started! ${TEAMS.A.name} are batting first.`]);
    setGameState("playing");
  };

  const portfolioValue =
    currentUser.stocks.teamA * stockPrices.teamA +
    currentUser.stocks.teamB * stockPrices.teamB;
  const totalAssets = currentUser.coins + portfolioValue;
  const currentInnings = currentBall < INNINGS_BREAK ? 1 : 2;

  if (showInstructions) {
    return <GameInstructionsModal onStart={startGame} />;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <button
          onClick={() => setPage("lobby")}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4 sm:mb-0"
        >
          <ArrowLeft size={20} />
          <span>Back to Lobby</span>
        </button>
        <div className="flex items-center space-x-4 bg-gray-800 p-2 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold">
              Ball: {currentBall}/{TOTAL_BALLS}
            </p>
            <p className="text-sm text-gray-400">Innings: {currentInnings}</p>
          </div>
          <div className="w-px h-10 bg-gray-600"></div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <Coins size={20} />
            <span className="font-semibold">
              {currentUser.coins?.toFixed(2)}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-600"></div>
          <div className="flex items-center space-x-2 text-green-400">
            <BarChart2 size={20} />
            <span className="font-semibold">{totalAssets.toFixed(2)}</span>
          </div>
        </div>
        {/* Team selection buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedTeamKey === "teamA"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setSelectedTeamKey("teamA")}
          >
            {TEAMS.A.name}
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedTeamKey === "teamB"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setSelectedTeamKey("teamB")}
          >
            {TEAMS.B.name}
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <TeamCard
            team={TEAMS.A}
            price={stockPrices.teamA}
            shares={currentUser.stocks.teamA}
            onTransaction={handleTransaction}
            teamKey="teamA"
            isBatting={battingTeamKey === "teamA"}
            disabled={selectedTeamKey !== null && selectedTeamKey !== "teamA"}
          />
          <TeamCard
            team={TEAMS.B}
            price={stockPrices.teamB}
            shares={currentUser.stocks.teamB}
            onTransaction={handleTransaction}
            teamKey="teamB"
            isBatting={battingTeamKey === "teamB"}
            disabled={selectedTeamKey !== null && selectedTeamKey !== "teamB"}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Stock Price History</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={priceHistory.slice(-50)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                  <XAxis
                    dataKey="event"
                    stroke="#a0aec0"
                    label={{
                      value: "Balls",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#a0aec0",
                    }}
                  />
                  <YAxis
                    stroke="#a0aec0"
                    domain={["dataMin - 10", "dataMax + 10"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d3748",
                      border: "none",
                      color: "#e2e8f0",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="teamA"
                    name={TEAMS.A.name}
                    stroke={TEAMS.A.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="teamB"
                    name={TEAMS.B.name}
                    stroke={TEAMS.B.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Event Log</h3>
            {gameState === "innings_break" && (
              <div className="text-center p-4 mb-2 bg-yellow-500 text-black rounded-lg font-bold animate-pulse">
                INNINGS BREAK
              </div>
            )}
            {gameState === "finished" && (
              <div className="text-center p-4 mb-2 bg-green-500 text-black rounded-lg font-bold">
                MATCH FINISHED
              </div>
            )}
            <div className="h-48 overflow-y-auto space-y-2 pr-2">
              {eventLog.map((log, index) => (
                <p
                  key={index}
                  className="text-sm text-gray-300 border-b border-gray-700 pb-1"
                >
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CricketGame;

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import {
  ArrowLeft,
  BarChart2,
  Coins,
  LogIn,
  LogOut,
  UserPlus,
  TrendingUp,
  TrendingDown,
  UserCircle,
  Info,
} from "lucide-react";

// --- FOLDER: src/App.js ---
// This is the main component that manages the application state and routing.

export default function App() {
  // --- State Management ---
  const [page, setPage] = useState("auth"); // 'auth', 'lobby', 'game'
  const [authView, setAuthView] = useState("login"); // 'login', 'signup'

  // Local state for users and authentication
  const [users, setUsers] = useState([]); // In-memory user "database"
  const [currentUser, setCurrentUser] = useState(null); // The currently logged-in user

  // Modal/Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [showComingSoon, setShowComingSoon] = useState(false);

  // --- Auth Functions (Local State) ---
  const handleSignup = (email, password, username) => {
    const userExists = users.some(
      (u) => u.email === email || u.username === username
    );
    if (userExists) {
      showNotification("Username or email already exists.", "error");
      return;
    }

    const newUser = {
      id: Date.now(), // Simple unique ID
      email,
      username,
      password, // In a real app, this should be hashed!
      coins: 1000,
      stocks: { teamA: 0, teamB: 0 },
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setPage("lobby");
    showNotification(
      `Welcome, ${username}! You've received 1000 coins.`,
      "success"
    );
  };

  const handleLogin = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      setPage("lobby");
      showNotification("Login successful!", "success");
    } else {
      showNotification("Invalid email or password.", "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("auth");
    showNotification("You have been logged out.", "info");
  };

  // --- User Data Update Function ---
  const updateUserData = (updatedData) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);

    // Also update the main users list to persist state during the session
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
  };

  // --- Notification Helper ---
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "info" }),
      3000
    );
  };

  // --- Page Rendering Logic ---
  const renderPage = () => {
    if (!currentUser) {
      return (
        <AuthPage
          view={authView}
          setView={setAuthView}
          onLogin={handleLogin}
          onSignup={handleSignup}
          showNotification={showNotification}
        />
      );
    }

    switch (page) {
      case "game":
        return (
          <CricketGame
            currentUser={currentUser}
            updateUserData={updateUserData}
            setPage={setPage}
            showNotification={showNotification}
          />
        );
      case "lobby":
      default:
        return (
          <LobbyPage
            setPage={setPage}
            setShowComingSoon={setShowComingSoon}
            handleLogout={handleLogout}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {renderPage()}
      {notification.show && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {showComingSoon && (
        <ComingSoonModal onClose={() => setShowComingSoon(false)} />
      )}
    </div>
  );
}

// --- FOLDER: src/components/AuthPage.js ---
// This component handles the Login and Signup forms.

const AuthPage = ({ view, setView, onLogin, onSignup, showNotification }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (view === "login") {
      if (!email || !password) {
        showNotification("Please fill in all fields.", "error");
        return;
      }
      onLogin(email, password);
    } else {
      if (password !== confirmPassword) {
        showNotification("Passwords don't match!", "error");
        return;
      }
      if (!email || !password || !username) {
        showNotification("Please fill in all fields.", "error");
        return;
      }
      onSignup(email, password, username);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Cricket Stock Arena</h1>
          <p className="text-gray-400 mt-2">
            {view === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {view === "signup" && (
            <InputField
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              Icon={UserCircle}
            />
          )}
          <InputField
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            Icon={LogIn}
          />
          <InputField
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            Icon={null}
          />
          {view === "signup" && (
            <InputField
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              Icon={null}
            />
          )}
          <button
            type="submit"
            className="w-full py-3 px-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition duration-300"
          >
            {view === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="text-center text-gray-400">
          {view === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setView("login")}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Login
              </button>
            </p>
          )}
          <p className="mt-2">
            <button className="text-sm text-gray-500 hover:text-gray-400">
              Forgot Password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- FOLDER: src/components/LobbyPage.js ---
// This component shows the game selection screen.

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

// --- FOLDER: src/components/CricketGame.js ---
// This is the main game component with the new logic.

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
          const loser =
            stockPrices.teamA < stockPrices.teamB ? TEAMS.A.name : TEAMS.B.name;
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
          />
          <TeamCard
            team={TEAMS.B}
            price={stockPrices.teamB}
            shares={currentUser.stocks.teamB}
            onTransaction={handleTransaction}
            teamKey="teamB"
            isBatting={battingTeamKey === "teamB"}
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

// --- FOLDER: src/components/TeamCard.js ---
// This component displays information for a single team.

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

// --- FOLDER: src/components/ui/InputField.js ---
// A reusable input field component.

const InputField = ({ id, type, value, onChange, placeholder, Icon }) => (
  <div className="relative">
    {Icon && (
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
    )}
    <input
      id={id}
      name={id}
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 ${
        Icon ? "pl-10" : ""
      } bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
    />
  </div>
);

// --- FOLDER: src/components/ui/Notification.js ---
// A component for showing pop-up notifications.

const Notification = ({ message, type }) => {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg z-50 animate-fade-in-out`}
    >
      {message}
    </div>
  );
};

// --- FOLDER: src/components/ui/Modals.js ---
// Components for various modals used in the app.

const ComingSoonModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-xl text-center shadow-2xl">
      <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
      <p className="text-gray-300 mb-6">
        This game is under development. Please check back later.
      </p>
      <button
        onClick={onClose}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
);

const GameInstructionsModal = ({ onStart }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 p-8 rounded-xl text-left shadow-2xl max-w-2xl w-full">
      <div className="flex items-center mb-4">
        <Info size={28} className="text-blue-400 mr-3" />
        <h2 className="text-3xl font-bold">Game Rules & How It Works</h2>
      </div>
      <div className="space-y-3 text-gray-300">
        <p>Welcome to the Cricket Stock Arena! Here's how to play:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            The match consists of <strong>40 balls</strong>, split into two{" "}
            <strong>20-ball innings</strong>.
          </li>
          <li>
            Both teams start with a stock price of <strong>Rs. 50</strong>.
          </li>
          <li>
            The stock price of the <strong>batting team</strong> increases on a{" "}
            <strong>Four (+2)</strong> or a <strong>Six (+4)</strong>.
          </li>
          <li>
            The stock price of the <strong>bowling team</strong> increases on a{" "}
            <strong>Wicket (+5)</strong>.
          </li>
          <li>
            When one team's stock goes up, the other's goes down by the same
            amount.
          </li>
          <li>
            After 20 balls, the teams switch roles. The match ends after 40
            balls.
          </li>
          <li>
            Your goal is to <strong>buy low and sell high</strong> to maximize
            your coins!
          </li>
        </ul>
        <p className="font-bold text-yellow-400 pt-2">
          The team with the higher stock price at the end of the match wins.
          Good luck!
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
      >
        Start Match
      </button>
    </div>
  </div>
);

// --- FOLDER: src/hooks/usePrevious.js ---
// A custom hook to get the previous value of a state or prop.

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

# Cricket Stock Arena 🏏💹

Welcome to **Cricket Stock Arena**, a dynamic web application that gamifies the stock market concept within a simulated cricket match. Users can sign up, receive starting coins, and then buy or sell stocks of two competing cricket teams. The stock prices fluctuate in real-time based on in-game events like boundaries and wickets. The goal is to maximize your assets by the end of the match!

This project is built entirely in **React** and uses local state management, making it a self-contained, single-file application ideal for understanding core React concepts.
 
---

## ✨ Features

- **User Authentication:** Simple and secure signup and login system (in-memory).
- **Game Lobby:** A central hub to select games (with other games marked as "Coming Soon").
- **Dynamic Stock Simulation:** Team stock prices change based on random match events (Fours, Sixes, Wickets).
- **Real-time Trading:** Buy and sell team stocks at any point during the match.
- **Live Data Visualization:** A responsive line chart from Recharts displays the stock price history.
- **Portfolio Management:** Keep track of your available coins and total asset value in real-time.
- **Event Log:** A running commentary of match events as they happen.
- **Responsive Design:** A clean, modern UI that works on various screen sizes.

---

## 🎮 How to Play

1. **Sign Up:** Create a new account to receive an initial balance of 1000 coins.
2. **Enter the Game:** From the lobby, select the "Cricket Stock" game to start.
3. **Analyze:** The match consists of 40 balls (two 20-ball innings). Both teams' stocks start at a price of $50.
4. **Trade:**
   - When the batting team hits a Four or a Six, their stock price increases, and the bowling team's price decreases.
   - When a Wicket falls, the bowling team's stock price increases, and the batting team's price decreases.
5. **Strategize:** Use the event log and price chart to make informed decisions. Buy low, sell high!
6. **Win:** The match ends after 40 balls. Your final asset value determines your success.

---

## 🛠️ Tech Stack

- **Frontend:** React.js  
- **Charting:** Recharts  
- **Icons:** Lucide React  
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`)  
- **Styling:** Plain CSS with class names inspired by Tailwind CSS (but not using the framework).  

---



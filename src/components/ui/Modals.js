import React from "react";
import { Info } from "lucide-react";

export const ComingSoonModal = ({ onClose }) => (
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

export const GameInstructionsModal = ({ onStart }) => (
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

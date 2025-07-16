import React, { useState } from "react";

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
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Cricket Stock Arena
        </h1>
        <p className="text-gray-400 text-center mb-6">
          {view === "login" ? "Welcome back!" : "Create your account"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {view === "signup" && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          >
            {view === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="text-center text-gray-400 mt-4">
          {view === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="text-blue-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setView("login")}
                className="text-blue-400 hover:underline"
              >
                Login
              </button>
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">Forgot Password?</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

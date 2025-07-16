import React from "react";

const Notification = ({ message, type }) => {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg z-50 animate-fade-in-out ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Notification;

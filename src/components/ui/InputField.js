import React from "react";

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

export default InputField;

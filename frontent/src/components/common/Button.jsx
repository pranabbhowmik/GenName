import React from "react";

const Button = ({ name, icon: Icon, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ${className}`}
    >
      {Icon && <Icon size={18} />}
      <span>{name}</span>
    </button>
  );
};

export default Button;

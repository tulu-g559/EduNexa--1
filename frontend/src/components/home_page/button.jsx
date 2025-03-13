import React from "react";

export default function Button({ variant = "default", size = "md", className = "", children, ...props }) {
  const baseStyles = "rounded font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    default: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2",
    ghost: "bg-transparent text-white hover:text-purple-400 border border-white",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      <span className="text-black">{children}</span>
    </button>
  );
}

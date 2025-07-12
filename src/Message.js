import React from "react";

// Use children for rich JSX (like bullet points), else fallback to plain text
const Message = ({ sender, text, children }) => (
  <div className={`message ${sender === "bot" ? "bot-message" : "user-message"}`}>
    {children ? children : text}
  </div>
);

export default Message;

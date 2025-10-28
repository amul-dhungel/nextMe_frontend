// src/Message.js
import React from "react";
import avatarSrc from "./me.png";
// Put your face in /public/me.jpg OR import from src
const BOT_AVATAR = avatarSrc; // or: const BOT_AVATAR = './me.png';

export default function Message({ sender, text, children }) {
  const isBot = sender === "bot";

  if (isBot) {
    return (
      <div className="msg msg--bot">
        <img className="msg__avatar" src={BOT_AVATAR} alt="Amul" />
        <div className="msg__bubble msg__bubble--bot">
          {children ? children : text}
        </div>
      </div>
    );
  }

  // user
  return (
    <div className="msg msg--user">
      <div className="msg__bubble msg__bubble--user">
        {children ? children : text}
      </div>
    </div>
  );
}

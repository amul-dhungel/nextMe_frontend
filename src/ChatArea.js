import React, { useState, useEffect, useCallback } from "react";
import Message from "./Message";
import TopNav from "./TopNav";
import MediaSlider from "./MediaSlider";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // navbar -> triggers a media section insert
  const [navTriggered, setNavTriggered] = useState(false);
  const [navBarName, setNavBarName] = useState(""); // e.g., "Achievements", "Certificates", ...

  // greet on mount
  useEffect(() => {
    const botGreeting = `Hi! I’m the AI consciousness of Amul, with a part of his personality built in.
I’m a mix of quiet mystery and friendly chatter—if we talk often. Besides programming, I am interested in physics, mathematics, and SaaS.
I am interested in connecting with people from different fields, so feel free to ask me anything!`;
    typeBotMessage(botGreeting);
  }, []);

  // If TopNav set both navTriggered and input, send it now
  useEffect(() => {
    if (navTriggered && input.trim()) {
      sendMessage();
      // We will append MediaSlider after the bot's response in fetchResponse()
    }
  }, [input, navTriggered]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    fetchResponse(text);
  }, [input]);

  const fetchResponse = async (userText) => {
    setLoading(true);
    setError("");
    setCurrentMessage("");
    setIsTyping(false);

    try {
      const response = await fetch("https://chairs-travels-bike-fuzzy.trycloudflare.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error("Error connecting to the server");
      const data = await response.json();
      const botMessage = data.response ?? "";

      typeBotMessage(botMessage);

      // If this came from TopNav, append MediaSlider for the selected folder
      if (navTriggered && navBarName) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            component: <MediaSlider defaultCollection={navBarName} />, // ✅ load that folder
          },
        ]);
        setNavTriggered(false); // reset AFTER using it
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // render helpers
  const tryRenderAsList = (text) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const bulletLines = lines.filter((line) => /^(\d+\.\s+|[-*•]\s+)/.test(line));
    if (bulletLines.length >= 2) {
      return (
        <ul style={{ paddingLeft: 22, margin: 0 }}>
          {bulletLines.map((line, i) => (
            <li key={i} style={{ marginBottom: 5, fontSize: 15 }}>
              {line.replace(/^(\d+\.\s+|[-*•]\s+)/, "")}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const typeBotMessage = useCallback((botMessage) => {
    let index = 0;
    setIsTyping(true);
    setCurrentMessage("");

    const tick = () => {
      if (index < botMessage.length) {
        setCurrentMessage((prev) => prev + botMessage[index]);
        index += 1;
        setTimeout(tick, 5);
      } else {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
        setCurrentMessage("");
      }
    };
    tick();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-area">
      <TopNav
        setInput={setInput}
        setNavTriggered={setNavTriggered}
        setNavBarName={setNavBarName} // TopNav should call setNavBarName("Achievements" | "Certificates" | ...)
      />

      <div className="chat-history" id="chat-history">
        {messages.map((msg, idx) => {
          if (msg.component) {
            return <React.Fragment key={idx}>{msg.component}</React.Fragment>;
          }
          if (msg.sender === "bot") {
            const list = tryRenderAsList(msg.text);
            return list ? (
              <Message key={idx} sender="bot">{list}</Message>
            ) : (
              <Message key={idx} sender="bot" text={msg.text} />
            );
          }
          return <Message key={idx} sender={msg.sender} text={msg.text} />;
        })}

        {isTyping && <Message sender="bot" text={currentMessage} />}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message..."
        />
        <button type="submit" onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChatComponent;

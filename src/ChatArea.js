import React, { useState, useEffect, useCallback } from 'react';
import Message from './Message';
import TopNav from './TopNav';
import MediaSlider from './MediaSlider';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [navTriggered, setNavTriggered] = useState(false);
  const [navbar_name, setNavBarName] = useState('');

  // Greet user on mount
  useEffect(() => {
    greetUser();
  }, []);

  const greetUser = useCallback(() => {
    const botGreeting = `Hi! I’m the AI consciousness of Amul, with a part of his personality built in.
I’m a mix of quiet mystery and friendly chatter—if we talk often. Besides programming, I am interested in physics, mathematics, and SaaS.
I’m here to help you with your questions, so feel free to ask me anything!`;
    typeBotMessage(botGreeting);
  }, []);

  // On navbar trigger, send message
  useEffect(() => {
    if (navTriggered && input) {
      sendMessage();
      setNavTriggered(false);
    }
    // eslint-disable-next-line
  }, [input, navTriggered]);

  const sendMessage = useCallback(() => {
    if (input.trim() === '') return;
    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    fetchResponse(userMessage.text);
    // eslint-disable-next-line
  }, [input]);

  const fetchResponse = async (userText) => {
    setLoading(true);
    setError('');
    setCurrentMessage('');
    setIsTyping(false);

    try {
      const response = await fetch('https://api.amuldhungel.com.np/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error('Error connecting to the server');

      const data = await response.json();
      const botMessage = data.response;

      typeBotMessage(botMessage);

      // Show MediaSlider if nav triggered
      if (navTriggered && userText.includes(navbar_name)) {
        const sliderResponse = { sender: 'bot', component: <MediaSlider containerName={navbar_name} /> };
        setMessages((prev) => [...prev, sliderResponse]);
      }

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to the server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Bullet point auto-render
  function renderBotMessage(text) {
    // Try to auto-detect bullet/numbered list
    const bulletLines = text
      .split('\n')
      .filter(line => /^(\s*[-*•]\s+|\d+\.\s+)/.test(line));
    if (bulletLines.length > 1) {
      // Bullet/numbered list detected
      return (
        <ul style={{ paddingLeft: 22, margin: 0 }}>
          {bulletLines.map((line, i) => (
            <li key={i} style={{ marginBottom: 5, fontSize: '15px' }}>
              {line.replace(/^(\s*[-*•]\s+|\d+\.\s+)/, '')}
            </li>
          ))}
        </ul>
      );
    }
    // Regular paragraph
    return null;
  }

  // Simulated typing effect for bot response
  const typeBotMessage = useCallback((botMessage) => {
    let index = 0;
    setIsTyping(true);
    setCurrentMessage('');
    function typeLetter() {
      if (index < botMessage.length) {
        setCurrentMessage(prev => prev + botMessage[index]);
        index++;
        setTimeout(typeLetter, 5);
      } else {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: botMessage }
        ]);
        setCurrentMessage('');
      }
    }
    typeLetter();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-area">
      <TopNav setInput={setInput} setNavTriggered={setNavTriggered} setNavBarName={setNavBarName} />
      <div className="chat-history" id="chat-history">
        {messages.map((msg, idx) => {
          // If component (like MediaSlider), just render that
          if (msg.component) {
            return <React.Fragment key={idx}>{msg.component}</React.Fragment>;
          }
          // For bot messages, try bullet/numbered list
          if (msg.sender === "bot") {
            const bulletList = renderBotMessage(msg.text);
            if (bulletList) {
              return <Message key={idx} sender="bot">{bulletList}</Message>;
            }
            // Otherwise, just normal text
            return <Message key={idx} sender="bot" text={msg.text} />;
          }
          // User messages
          return <Message key={idx} sender={msg.sender} text={msg.text} />;
        })}
        {isTyping && <Message sender="bot" text={currentMessage} />}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your message..."
        />
        <button type="submit" onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChatComponent;

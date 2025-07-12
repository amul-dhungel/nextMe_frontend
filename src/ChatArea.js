import React, { useState, useEffect } from 'react';
import Message from './Message';  // Assuming you have a Message component for rendering individual messages
import TopNav from './TopNav';
import MediaSlider from './MediaSlider'; // Import the MediaSlider component
import showSlider from './MediaSlider'; // Import the showSlider function if needed

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMessage, setCurrentMessage] = useState(''); // For typing animation
  const [isTyping, setIsTyping] = useState(false); // New flag to control typing state
  const [navTriggered, setNavTriggered] = useState(false); // Track if navbar triggered the change
  const [showSlider, setShowSlider] = useState(false); // To display the slider after the text
  const [navbar_name,setNavBarName ] = useState('')
 
  useEffect(() => {
    greetUser();
    console.log("greet");
  }, []);

  const greetUser = () => {
    const botGreeting = `Hi! I’m the AI consciousness of Amul, with a part of his personality built in.
I’m a mix of quiet mystery and friendly chatter—if we talk often. Beside programming, I am interested in physics, mathematics, and Saas.
I’m here to help you with your questions, so feel free to ask me anything!`;

    typeBotMessage(botGreeting);
  };

  // This useEffect will trigger the sendMessage function whenever the navTriggered state is true
  useEffect(() => {
    if (navTriggered && input) {
      sendMessage();
      setNavTriggered(false); // Reset navTriggered after sending the message
    }
  }, [input, navTriggered]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages([...messages, userMessage]);
    setInput('');

    fetchResponse(userMessage.text);
  };

  const fetchResponse = async (userText) => {
    setLoading(true);
    setError('');
    setCurrentMessage(''); // Clear currentMessage before starting typing
    setIsTyping(false);

    try {
      const response = await fetch('https://api.amuldhungel.com.np/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error('Error connecting to the server');
      }

      const data = await response.json();
      const botMessage = data.response; // Full message from the bot

      typeBotMessage(botMessage); // Start typing the message
      console.log({ navbar_name }); // output { navbar_name : 'projects' }
      // Only show MediaSlider if the navbar triggered the message
      if (navTriggered && userText.includes(navbar_name)) {
        // Reset showSlider each time a specific navbar item is mentioned
        const sliderResponse = { sender: 'bot', component: <MediaSlider containerName={navbar_name} /> };
        setMessages((prevMessages) => [...prevMessages, sliderResponse]);
        setShowSlider(true);
      }
      

    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Error connecting to the server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simulates typing effect for the bot's response
  const typeBotMessage = (botMessage) => {
    let index = 0;
    setIsTyping(true); // Start typing
    setCurrentMessage(''); // Clear the previous message

    const typeLetter = () => {
      if (index < botMessage.length) {
        setCurrentMessage((prev) => prev + botMessage[index]);
        index++;
        setTimeout(typeLetter, 5); // Adjust typing speed here (in ms)
      } else {
        // Once typing is complete, update the messages array and clear currentMessage
        setIsTyping(false); // Stop typing
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botMessage },
        ]);
        setCurrentMessage(''); // Clear currentMessage after typing
      }
    };

    typeLetter(); // Start the typing process
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-area">
      {/* Pass setInput and setNavTriggered to TopNav */}
      <TopNav setInput={setInput} setNavTriggered={setNavTriggered} setNavBarName={(setNavBarName)} />
      {/* {console.log(navbar_name)} */}
      <div className="chat-history" id="chat-history">
        {messages.map((msg, index) => (
      
            msg.component || <Message sender={msg.sender} text={msg.text} />
      
        ))}
        {/* Display the message currently being "typed out" only if typing */}
        {isTyping && <Message sender="bot" text={currentMessage} />}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

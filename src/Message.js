import React from 'react';

const Message = ({ sender, text }) => {
  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
      {/* Use dangerouslySetInnerHTML to render structured HTML */}
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

export default Message;

import React, { useState, useEffect } from 'react';
import socket from '../socket';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'text', content: message }]);
    });

    socket.on('image', (imagePath) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'image', content: imagePath }]);
    });

    return () => {
      socket.off('message');
      socket.off('image');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'text' ? msg.content : <img src={msg.content} alt="Uploaded" style={{ maxWidth: '200px' }} />}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

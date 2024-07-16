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

    socket.on('file', (file) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'file', content: file.filePath, fileType: file.fileType }]);
    });

    return () => {
      socket.off('message');
      socket.off('image');
      socket.off('file');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  const renderFile = (file) => {
    const { fileType, content } = file;
    if (fileType.startsWith('image')) {
      return <img src={content} alt="Uploaded" style={{ maxWidth: '200px' }} />;
    }
    if (fileType.startsWith('video')) {
      return <video src={content} controls style={{ maxWidth: '200px' }} />;
    }
    if (fileType === 'application/pdf') {
      return <a href={content} target="_blank" rel="noopener noreferrer">View PDF</a>;
    }
    return null;
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'text' ? msg.content : renderFile(msg)}
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

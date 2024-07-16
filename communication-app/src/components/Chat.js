import React, { useState, useEffect } from 'react';
import socket from '../socket';
import './ChatWindow.css';

const Chat = () => {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.on('user-id', (id) => {
      setUserId(id);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'text', content: data.message, userId: data.userId }]);
    });

    socket.on('image', (imagePath) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'image', content: imagePath }]);
    });

    socket.on('file', (file) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'file', content: file.filePath, fileType: file.fileType, userId: file.userId }]);
    });

    return () => {
      socket.off('message');
      socket.off('image');
      socket.off('file');
    };
  }, []);

  // const sendMessage = () => {
  //   socket.emit('message', { message, userId });
  //   setMessages((prevMessages) => [...prevMessages, { type: 'text', content: message, userId }]);
  //   setMessage('');
  // };

  const sendMessage = () => {
    if (userId) {
      socket.emit('message', { message, userId });
      setMessage('');
    }
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
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.userId === userId ? 'right' : 'left' }}>
            {msg.type === 'text' ? (
              <div className="text-message">{msg.content}</div>
            ) : (
              <div className="file-message">{renderFile(msg)}</div>
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;

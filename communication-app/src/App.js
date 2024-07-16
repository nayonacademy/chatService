import React from 'react';
import Chat from './components/Chat';
import PhotoUpload from './components/PhotoUpload';
import Call from './components/Call';

const App = () => {
  return (
    <div>
      <h1>Communication App</h1>
      <Chat />
      <Call />
      <PhotoUpload />
    </div>
  );
};

export default App;

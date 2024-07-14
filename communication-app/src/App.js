import React from 'react';
import Chat from './components/Chat';
import PhotoUpload from './components/PhotoUpload';

const App = () => {
  return (
    <div>
      <h1>Communication App</h1>
      <Chat />
      <PhotoUpload />
    </div>
  );
};

export default App;

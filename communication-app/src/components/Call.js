// src/components/Call.js
import React from 'react';
import RTCClient from '../webrtc/RTCClient';

const Call = () => {
  const { initiateCall } = RTCClient();

  const handleCall = () => {
    initiateCall('receiverSocketId');
  };

  return (
    <div>
      <button onClick={handleCall}>Call</button>
    </div>
  );
};

export default Call;

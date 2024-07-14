// src/webrtc/RTCClient.js
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const RTCClient = () => {
  const socketRef = useRef();
  const peerRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');

    socketRef.current.on('call-made', async (data) => {
      const { offer, socket: callerSocketId } = data;
      peerRef.current = new SimplePeer({ initiator: false, trickle: false });

      peerRef.current.on('signal', (answer) => {
        socketRef.current.emit('call-user', { answer, to: callerSocketId });
      });

      peerRef.current.on('connect', () => {
        console.log('Peer connected');
      });

      peerRef.current.on('data', (data) => {
        console.log('Received data:', data.toString());
      });

      peerRef.current.signal(offer);
    });

    socketRef.current.on('answer-call', async (data) => {
      const { answer } = data;
      peerRef.current.signal(answer);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const initiateCall = async (to) => {
    peerRef.current = new SimplePeer({ initiator: true, trickle: false });

    peerRef.current.on('signal', (offer) => {
      socketRef.current.emit('call-user', { offer, to });
    });

    peerRef.current.on('connect', () => {
      console.log('Peer connected');
    });

    peerRef.current.on('data', (data) => {
      console.log('Received data:', data.toString());
    });
  };

  return { initiateCall };
};

export default RTCClient;

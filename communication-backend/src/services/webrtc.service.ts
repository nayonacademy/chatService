// src/services/webrtc.service.ts
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as SimplePeer from 'simple-peer';

@Injectable()
export class WebRTCService {
  private peers: Map<string, SimplePeer.Instance> = new Map();

  constructor(private io: Server) {}

  handleConnection(socket: Socket) {
    socket.on('call-user', (data) => {
      const { to, offer } = data;
      const peer = new SimplePeer({ initiator: false, trickle: false });

      peer.on('signal', (answer) => {
        this.io.to(to).emit('answer-call', { answer });
      });

      peer.on('connect', () => {
        console.log('Peer connected');
      });

      peer.on('data', (data) => {
        console.log('Received data:', data.toString());
      });

      peer.signal(offer);

      this.peers.set(socket.id, peer);
    });

    socket.on('disconnect', () => {
      if (this.peers.has(socket.id)) {
        const peer = this.peers.get(socket.id);
        peer.destroy();
        this.peers.delete(socket.id);
      }
    });
  }

  initiateCall(socket: Socket, to: string, offer: any) {
    const peer = new SimplePeer({ initiator: true, trickle: false });

    peer.on('signal', (offer) => {
      this.io.to(to).emit('call-made', { offer, socket: socket.id });
    });

    peer.on('connect', () => {
      console.log('Peer connected');
    });

    peer.on('data', (data) => {
      console.log('Received data:', data.toString());
    });

    peer.signal(offer);

    this.peers.set(socket.id, peer);
  }
}

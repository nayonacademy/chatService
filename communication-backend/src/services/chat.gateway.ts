// src/gateways/chat.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebRTCService } from '../services/webrtc.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private webrtcService: WebRTCService) {}

  handleConnection(client: Socket) {
    this.webrtcService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    // Clean up WebRTC connections if needed
  }
}

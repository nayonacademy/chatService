import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WebRTCService } from '../services/webrtc.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private clients: Map<string, string> = new Map();
  private logger: Logger = new Logger('ChatGateway');

  constructor(private webrtcService: WebRTCService) {}
  
  handleConnection(client: Socket) {
    const userId = uuidv4();
    this.clients.set(client.id, userId);
    client.emit('user-id', userId); // Send UUID to client
    this.webrtcService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    // Clean up WebRTC connections if needed
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { message: string, userId: string }, @ConnectedSocket() client: Socket) {
    this.server.emit('message', { message: data.message, userId: data.userId });
  }

  @SubscribeMessage('file')
  handleFile(@MessageBody() data: { filePath: string, fileType: string, userId: string }) {
    this.server.emit('file', { filePath: data.filePath, fileType: data.fileType, userId: data.userId });
  }
  
  afterInit(server: Server) {
    this.logger.log('Init');
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chat.gateway';
import { UploadsController } from './uploads/uploads.controller';
import { WebRTCService } from './services/webrtc.service';
import { Server } from 'socket.io';

@Module({
  imports: [],
  controllers: [AppController, UploadsController],
  providers: [
    AppService,
    ChatGateway,
    WebRTCService,
    {
      provide: Server,
      useFactory: () => {
        const io = new Server(); // Pass the port number to the Server constructor
        return io;
      },
    },
  ],
})
export class AppModule {}

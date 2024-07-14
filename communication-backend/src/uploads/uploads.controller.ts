import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChatGateway } from '../gateways/chat.gateway';

@Controller('uploads')
export class UploadsController {
  constructor(private chatGateway: ChatGateway) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file) {
    const filePath = `http://localhost:8000/uploads/${file.filename}`;
    this.chatGateway.server.emit('image', filePath); // Broadcast the image path
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: filePath
    };
  }
}

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
    fileFilter: (req, file, cb) => {
      // Accept images, videos, and PDFs
      const filetypes = /jpeg|jpg|png|gif|mp4|mkv|pdf/;
      const mimetype = filetypes.test(file.mimetype);
      const extname1 = filetypes.test(extname(file.originalname).toLowerCase());
      if (mimetype && extname1) {
        return cb(null, true);
      }
      cb(new Error('File type not supported'), false);
    },
  }))
  uploadFile(@UploadedFile() file) {
    const filePath = `http://localhost:8000/uploads/${file.filename}`;
    this.chatGateway.server.emit('file', { filePath, fileType: file.mimetype }); // Broadcast the file path and type
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: filePath,
    };
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreatePostDto } from 'src/post/dto/create-post.dto';

@WebSocketGateway(3002, { namespace: 'noti' })
export class NotiGateways implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // userId -> socketId
  private onlineUsers = new Map<number, string>();

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
      }
    }
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('user-online')
  handleUserOnline(client: Socket, userId: number) {
    this.onlineUsers.set(userId, client.id);
    console.log('Online users:', this.onlineUsers);
  }

  notifyNewPost(post: CreatePostDto, authorId: number) {
    this.onlineUsers.forEach((socketId, userId) => {
      if (userId !== authorId) {
        this.server.to(socketId).emit('new-post-notification', {
          message: 'New post created',
          post,
        });
      }
    });
  }
}

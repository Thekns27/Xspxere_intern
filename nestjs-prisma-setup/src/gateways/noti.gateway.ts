
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { CreatePostDto } from 'src/post/dto/create-post.dto';

@WebSocketGateway(3002, { namespace: 'notifications' })
export class NotiGateways implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private getnotiUser = new Map<number, string>();

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.getnotiUser.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.getnotiUser.entries()) {
      if (socketId === client.id) {
        this.getnotiUser.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  notifyNewPost(postData: CreatePostDto, authorId: number) {
    this.getnotiUser.forEach((socketId, userId) => {
      if (userId !== authorId) {
        this.server.to(socketId).emit('new-post-notification', {
          message: `New post createBy ${userId}`,
          postTitle: postData.title,
          authorId: authorId,
        });
      }
    });
  }

  //   notifyNewPost(post: any) {
  //   post.tags.forEach((tag) => {
  //     const targetSocketId = this.getnotiUser.get(tag.userId);
  //     if (targetSocketId) {
  //       this.server.to(targetSocketId).emit('tag-notification', {
  //         message: `New post tagged by ${tag.user.name}`,
  //         postId: post.id
  //       });
  //     }
  //   });
  // }
}

@WebSocketGateway(3002, { namespace: 'notifications', cors: true })
export class NotiGateways2 implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // using room
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;

    if (userId) {
      client.join(`user_${userId}`);
      console.log(`User ${userId} joined room: user_${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyNewPost(postData: CreatePostDto, authorId: number) {
    this.server.except(`user_${authorId}`).emit('new-post-notification', {
      message: `New post created!`,
      postTitle: postData.title,
      authorId: authorId,
    });
  }
}



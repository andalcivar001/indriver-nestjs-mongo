import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado de Socket.IO: ${client.id}`);

    client.conn.on('close', (reason) => {
      console.log(`Conexión cerrada: ${client.id}`);
      console.log(`Motivo del cierre: ${reason}`);
    });

    client.conn.on('error', (error) => {
      console.error(`Error de conexión: ${client.id}`, error);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado de Socket.IO: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    console.log('Nuevo mensaje:', data);
    this.server.emit('new_message', 'Bien, gracias');
  }

  @SubscribeMessage('change_driver_position')
  handleChangeDriverPosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log('Nueva posición:', data);

    this.server.emit('new_driver_position', {
      id_socket: client.id,
      id: data.id,
      lat: data.lat,
      lng: data.lng,
    });
  }
}

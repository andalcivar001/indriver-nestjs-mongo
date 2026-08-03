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
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  //OnGatewayDisconnect: Se ejecuta cuando un cliente se desconecta del gateway de sockets.
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado de SOCKET IO: ${client.id}`);

    // Detecta cuándo se cierra la conexión subyacente.
    client.conn.on('close', (reason) => {
      console.log(`Conexión cerrada: ${client.id}`);
      console.log(`Motivo del cierre: ${reason}`);
    });

    // Detecta errores del transporte.
    client.conn.on('error', (error) => {
      console.error(`Error de conexión: ${client.id}`, error);
    });
  }

  //OnGatewayConnection: Se ejecuta cuando un cliente se conecta al gateway de sockets.
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Cliente conectado de SOCKET IO: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log('Nuevo mensaje :', data);
    client.emit('new_message', 'Bien Gracias');
  }

  @SubscribeMessage('change_driver_position')
  handleChangeDriverPosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log('Nueva posicion:', data);
    client.emit('new_driver_position', {
      id: data.id,
      lat: data.lat,
      lng: data.lng,
    });
  }
}

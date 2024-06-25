import {
	ConnectedSocket,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Appeal } from '../appeal/appeal.model';
import { Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class SocketService implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('update-appeal')
	handleUpdateAppeal(appeal: Appeal) {
		this.server.emit('update-appeal-client', appeal);
	}

	@SubscribeMessage('server-path')
	handleEvent(dto: any, @ConnectedSocket() client: any) {
		const res = { type: 'sameType', dto };
		client.emit('client-path', res);
	}

	handleConnection(client: any, ...args): any {}
}

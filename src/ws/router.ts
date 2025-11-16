import type { WebSocket } from 'ws';
import type { WSMessage } from './types';
import { handleReg } from './handlers/handleReg';
import { handleRoom } from './handlers/handleRoom';
import { log } from '../utils/log';

export const router = (ws: WebSocket, message: WSMessage<any>) => {
  switch (message.type) {
    case 'reg':
      return handleReg(ws, message);

    case 'create_room':
    case 'add_user_to_room':
      return handleRoom(ws, message);

    default:
      console.warn('Unknown message type', message.type);
      ws.send(
        JSON.stringify({
          type: 'debug',
          data: 'Unknown message type',
          id: 0,
        }),
      );
      log(message, { type: 'debug', data: 'Unknown message type', id: 0 });
  }
};

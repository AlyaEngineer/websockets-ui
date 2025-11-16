import type { WebSocket } from 'ws';
import type { WSMessage } from './types';
import { handleReg } from './handlers/handleReg';
import type { WSMessage } from './types';

export const router = (ws: WebSocket, message: WSMessage<any>) => {
  switch (message.type) {
    case 'reg':
      return handleReg(ws, message);
    default:
      console.warn('Unknown message type', message.type);
      ws.send(
        JSON.stringify({
          type: 'debug',
          data: 'Unknown message type',
          id: 0,
        }),
      );
  }
};

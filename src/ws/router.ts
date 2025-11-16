import type { WebSocket } from 'ws';
import { handleReg } from './handlers/handleReg';
import type { WSMessage } from './types';

export const router = (ws: WebSocket, message: WSMessage<any>) => {
  switch (message.type) {
    case 'registration':
      return handleReg(ws, message);
    default:
      console.warn('Unknown message type', message);
      ws.send(
        JSON.stringify({
          type: 'debug',
          data: 'Unknown message type',
          id: 0,
        }),
      );
  }
};

import type { WebSocket } from 'ws';
import type { WSMessage, RegRequestMessage } from './types';

import { handleReg } from './handlers/handleReg';
import { handleRoom } from './handlers/handleRoom';

import { log } from '../utils/log';

export const router = (ws: WebSocket, message: WSMessage) => {
  if (typeof message.data === 'string') {
    try {
      const parsed = JSON.parse(message.data);
      if (typeof parsed === 'object' && parsed !== null) {
        message.data = parsed;
      }
    } catch {}
  }

  log('IN', message);

  switch (message.type) {
    case 'reg':
      return handleReg(ws, message as RegRequestMessage);

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
  }
};

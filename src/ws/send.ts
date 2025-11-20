import type { WebSocket } from 'ws';
import type { WSMessage } from './types';
import { log } from '@/utils/log';

export const send = (ws: WebSocket, message: WSMessage) => {
  try {
    const normalized = {
      ...message,
      data: typeof message.data === 'string' ? message.data : JSON.stringify(message.data),
    };

    const json = JSON.stringify(normalized);

    ws.send(json);
    log('SEND', normalized);
  } catch (err) {
    console.error('Failed to send WS message:', err);
  }
};

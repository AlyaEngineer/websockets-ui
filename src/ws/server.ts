import { WebSocketServer } from 'ws';
import { router } from './router';
import { log } from '../utils/log';

const PORT = 3000;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  log('Client connected');

  ws.on('message', (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      log('Invalid JSON');
      return;
    }

    router(ws, message);
  });

  ws.on('close', () => log('Client disconnected'));
});

log(`WebSocket server running on ws://localhost:${PORT} (backend started)`);

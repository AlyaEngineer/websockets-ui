import { WebSocketServer } from 'ws';
import { router } from './router';
import { log } from '../utils/log';
import { playersStorage } from '@/storage/players';
import { roomsStorage } from '@/storage/rooms';
import { sendRoomsUpdate } from '@/utils/updateRooms';

const PORT = 3000;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  log('Client connected');

  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(raw.toString());
      router(ws, message);
    } catch {
      log('Invalid JSON');
    }
  });

  ws.on('close', () => {
    const player = playersStorage.getByWS(ws);
    if (player) {
      roomsStorage.removePlayer(player.id);
      sendRoomsUpdate();
      log(`Client disconnected: ${player.name}`);
    } else {
      log('Client disconnected');
    }
  });
});

log(`WebSocket server running on ws://localhost:${PORT} (backend started)`);

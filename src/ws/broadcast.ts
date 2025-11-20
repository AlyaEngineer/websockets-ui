import { roomsStorage } from '@/storage/rooms';
import { send } from './send';
import type { WSMessage } from './types';
import { playersStorage } from '@/storage/players';
import { log } from '@/utils/log';

export const broadcastAll = (message: WSMessage): void => {
  playersStorage.getAll().forEach((player) => {
    if (player.ws && player.ws.readyState === 1) {
      send(player.ws, message);
    }
  });

  log('BROADCAST ALL', message);
};

export const broadcastRoom = (roomId: string, message: WSMessage): void => {
  const room = roomsStorage.getById(roomId);
  if (!room) return;

  const json = JSON.stringify(message);

  room.users.forEach((user) => {
    const player = playersStorage.getById(user.index);
    if (player?.ws && player.ws.readyState === 1) {
      player.ws.send(json);
    }
  });

  log(`BROADCAST ROOM ${roomId}`, message);
};

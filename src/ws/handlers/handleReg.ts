import type { WebSocket } from 'ws';
import type { RegRequestMessage } from '../types';
import { playersStorage } from '@/storage/players';
import { winnersStorage } from '@/storage/winners';
import { roomsStorage } from '@/storage/rooms';
import { send } from '../send';
import { broadcastAll } from '../broadcast';
import { generateId } from '@/utils/generateId';
import { log } from '@/utils/log';

export const handleReg = (ws: WebSocket, message: RegRequestMessage) => {
  const { name, password } = message.data;

  if (!name || !password) {
    return send(ws, {
      type: 'reg',
      data: { name, index: '', error: true, errorText: 'Name and password are required' },
      id: message.id,
    });
  }

  let player = playersStorage.getByName(name);

  if (!player) {
    const newId = generateId();
    playersStorage.add({ id: newId, name, password, ws });
    winnersStorage.ensurePlayer(name);

    send(ws, {
      type: 'reg',
      data: { name, index: newId, error: false, errorText: '' },
      id: message.id,
    });

    broadcastAll({
      type: 'update_winners',
      data: winnersStorage.getAll(),
      id: 0,
    });

    broadcastAll({
      type: 'update_room',
      data: roomsStorage.getAvailableRooms().map((r) => ({
        roomId: r.roomId,
        roomUsers: r.users.map((u) => ({ name: u.name, index: u.index })),
      })),
      id: 0,
    });

    log('Player registered:', name);
    return;
  }

  if (player.password !== password) {
    return send(ws, {
      type: 'reg',
      data: { name, index: '', error: true, errorText: 'Wrong password' },
      id: message.id,
    });
  }

  player.ws = ws;

  send(ws, {
    type: 'reg',
    data: { name: player.name, index: player.id, error: false, errorText: '' },
    id: message.id,
  });

  winnersStorage.ensurePlayer(name);

  broadcastAll({
    type: 'update_winners',
    data: winnersStorage.getAll(),
    id: 0,
  });

  broadcastAll({
    type: 'update_room',
    data: roomsStorage.getAvailableRooms().map((r) => ({
      roomId: r.roomId,
      roomUsers: r.users.map((u) => ({ name: u.name, index: u.index })),
    })),
    id: 0,
  });

  log('Player logged in:', name);
};

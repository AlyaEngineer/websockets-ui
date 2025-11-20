import type { Player } from '@/ws/types';
import type { WebSocket } from 'ws';

const players: Player[] = [];

export const playersStorage = {
  add(player: Player) {
    players.push(player);
  },

  getByName(name: string) {
    return players.find((p) => p.name === name);
  },

  getById(id: string) {
    return players.find((p) => p.id === id);
  },

  getByWS(ws: WebSocket) {
    return players.find((p) => p.ws === ws);
  },

  getAll() {
    return players;
  },
};

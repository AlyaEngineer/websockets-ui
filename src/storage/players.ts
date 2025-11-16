import type { WebSocket as WSWebSocket } from 'ws';
import { Player } from '../ws/types';

const players: Player[] = [];

export const addPlayer = (player: Player) => {
  players.push(player);
};

export const findPlayerByName = (name: string) => {
  return players.find((p) => p.name === name);
};

export const findPlayerByWs = (ws: WSWebSocket): Player | undefined =>
  players.find((p) => p.ws && p.ws === ws);

export const getPlayers = () => players;

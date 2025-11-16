import { Player } from '../ws/types';

const players: Player[] = [];

export const addPlayer = (player: Player) => {
  players.push(player);
};

export const findPlayerByName = (name: string) => {
  return players.find((p) => p.name === name);
};

export const getPlayers = () => players;

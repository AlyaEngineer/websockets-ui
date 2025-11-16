import { v4 as uuidv4 } from 'uuid';
import { Player } from '../ws/types';

interface Game {
  id: string;
  players: Player[];
}

const games: Game[] = [];

export const createGame = (players: Player[]): Game => {
  const game: Game = { id: uuidv4(), players };
  games.push(game);
  return game;
};

export const getGameById = (gameId: string): Game | undefined => games.find((g) => g.id === gameId);

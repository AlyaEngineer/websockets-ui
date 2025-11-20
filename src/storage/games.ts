import { v4 as uuidv4 } from 'uuid';
import { Player } from '@/ws/types';

export interface Game {
  id: string;
  players: Player[];
  currentPlayerIndex?: string;
}

class GamesStorage {
  private games: Game[] = [];

  create(players: Player[]): Game {
    const game: Game = { id: uuidv4(), players };
    this.games.push(game);
    return game;
  }

  getById(gameId: string): Game | undefined {
    return this.games.find((g) => g.id === gameId);
  }

  update(game: Game) {
    const index = this.games.findIndex((g) => g.id === game.id);
    if (index !== -1) this.games[index] = game;
  }
}

export const gamesStorage = new GamesStorage();

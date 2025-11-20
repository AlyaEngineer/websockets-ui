import type { WebSocket as WSWebSocket } from 'ws';

export interface Player {
  ws?: WSWebSocket;
  id: string;
  name: string;
  password: string;
}

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  hits?: number;
}

export interface GamePlayer {
  playerId: string;
  ws?: WSWebSocket;
  ships?: Ship[];
  ready?: boolean;
}

export interface Game {
  idGame: string;
  players: GamePlayer[];
  currentTurn?: string;
  finished?: boolean;
}

export interface RoomUser {
  id: string;
  name: string;
}

export interface Room {
  roomId: string;
  users: RoomUser[];
}

export interface WSMessageBase {
  id: number;
}

export interface RegData {
  name: string;
  password: string;
}

export interface RegResponseData {
  name: string;
  index: string | number;
  error: boolean;
  errorText?: string;
}

export interface RegRequestMessage extends WSMessageBase {
  type: 'reg';
  data: RegData;
}

export interface RegResponseMessage extends WSMessageBase {
  type: 'reg';
  data: RegResponseData;
}

export type RegMessage = RegRequestMessage;
export type RegResponse = RegResponseMessage;

export interface CreateRoomMessage extends WSMessageBase {
  type: 'create_room';
  data: '';
}

export interface AddUserToRoomMessage extends WSMessageBase {
  type: 'add_user_to_room';
  data: { indexRoom: string | number };
}

export interface UpdateWinnersMessage extends WSMessageBase {
  type: 'update_winners';
  data: {
    name: string;
    wins: number;
  }[];
}

export type RoomMessage = CreateRoomMessage | AddUserToRoomMessage;

export interface RoomInfo {
  roomId: string | number;
  roomUsers: {
    name: string;
    index: string | number;
  }[];
}

export interface UpdateRoomMessage extends WSMessageBase {
  type: 'update_room';
  data: RoomInfo[];
}

export interface CreateGameMessage extends WSMessageBase {
  type: 'create_game';
  data: {
    idPlayer: string | number;
    idGame: string | number;
  };
}

export type RoomResponse = UpdateRoomMessage | CreateGameMessage;

export interface AddShipsMessage extends WSMessageBase {
  type: 'add_ships';
  data: {
    gameId: string | number;
    indexPlayer: string | number;
    ships: Ship[];
  };
}

export interface StartGameMessage extends WSMessageBase {
  type: 'start_game';
  data: {
    ships: Ship[];
    currentPlayerIndex: string | number;
  };
}

export interface AttackMessage extends WSMessageBase {
  type: 'attack';
  data: {
    gameId: string | number;
    indexPlayer: string | number;
    x?: number;
    y?: number;
    position?: { x: number; y: number };
    status?: 'miss' | 'shot' | 'killed';
    currentPlayer?: string | number;
  };
}

export interface TurnMessage extends WSMessageBase {
  type: 'turn';
  data: { currentPlayer: string | number };
}

export interface FinishMessage extends WSMessageBase {
  type: 'finish';
  data: { winPlayer: string | number };
}

export type WSMessage =
  | RoomMessage
  | RoomResponse
  | RegMessage
  | RegResponse
  | AddShipsMessage
  | StartGameMessage
  | AttackMessage
  | TurnMessage
  | FinishMessage
  | UpdateWinnersMessage;

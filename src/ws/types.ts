import type { WebSocket as WSWebSocket } from 'ws';

export interface Player {
  sessionId?: string;
  ws?: WSWebSocket;
  id: string;
  name: string;
  password: string;
  wins: number;
}

export interface WSMessage<T> {
  type: string;
  id: number;
  data: T;
}

export interface RegData {
  name: string;
  password: string;
}

export interface RegResponseData {
  name: string;
  index: string;
  error: boolean;
  errorText?: string;
}

export interface RoomData {
  rooms: {
    roomId: string;
    roomUsers: {
      name: string;
      index: string;
    }[];
  }[];
}

export interface RoomInfo {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
}

export interface Player {
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
  playerId: string;
  error: boolean;
  errorText?: string;
}

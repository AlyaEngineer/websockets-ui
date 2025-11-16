import { v4 as uuidv4 } from 'uuid';
import { Player } from '../ws/types';

interface Room {
  id: string;
  users: Player[];
}

const rooms: Room[] = [];

export const getRooms = (): Room[] => rooms;

export const findRoomById = (roomId: string): Room | undefined =>
  rooms.find((r) => r.id === roomId);

export const createRoom = (player: Player): Room => {
  const newRoom: Room = { id: uuidv4(), users: [player] };
  rooms.push(newRoom);
  return newRoom;
};

export const addPlayerToRoom = (roomId: string, player: Player): boolean => {
  const room = findRoomById(roomId);
  if (!room) return false;
  if (!room.users.find((u) => u.id === player.id)) room.users.push(player);
  return true;
};

export const removeRoom = (roomId: string): void => {
  const index = rooms.findIndex((r) => r.id === roomId);
  if (index !== -1) rooms.splice(index, 1);
};

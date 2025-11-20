import { Player } from '@/ws/types';
import { generateId } from '@/utils/generateId';

interface Room {
  roomId: string;
  users: { name: string; index: string }[];
}

const rooms: Room[] = [];

export const roomsStorage = {
  getAvailableRooms() {
    return rooms.filter((r) => r.users.length < 2);
  },

  createRoom(player: Player) {
    if (rooms.some((r) => r.users.some((u) => u.index === player.id))) {
      return null;
    }

    const room: Room = {
      roomId: generateId(),
      users: [{ name: player.name, index: player.id }],
    };
    rooms.push(room);
    return room;
  },

  addUser(roomId: string, player: Player) {
    const room = rooms.find((r) => r.roomId === roomId);
    if (!room) return null;

    if (room.users.some((u) => u.index === player.id)) return room;

    if (room.users.length >= 2) return null;

    room.users.push({ name: player.name, index: player.id });
    return room;
  },

  remove(roomId: string) {
    const i = rooms.findIndex((r) => r.roomId === roomId);
    if (i !== -1) rooms.splice(i, 1);
  },

  getById(roomId: string) {
    return rooms.find((r) => r.roomId === roomId);
  },

  removePlayer(playerId: string) {
    rooms.forEach((room, i) => {
      room.users = room.users.filter((u) => u.index !== playerId);
      if (room.users.length === 0) {
        rooms.splice(i, 1);
      }
    });
  },

  getRoomInfoList() {
    return rooms.map((r) => ({
      roomId: r.roomId,
      roomUsers: r.users.map((u) => ({ name: u.name, index: u.index })),
    }));
  },
};

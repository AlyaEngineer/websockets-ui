import { roomsStorage } from '@/storage/rooms';
import { broadcastAll } from '../ws/broadcast';

export function sendRoomsUpdate() {
  const rooms = roomsStorage.getAvailableRooms();
  broadcastAll({
    type: 'update_room',
    data: rooms.map((r) => ({
      roomId: r.roomId,
      roomUsers: r.users.map((u) => ({ name: u.name, index: u.index })),
    })),
    id: 0,
  });
}

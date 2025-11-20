import type { WebSocket } from 'ws';
import { playersStorage } from '@/storage/players';
import { roomsStorage } from '@/storage/rooms';
import { generateId } from '@/utils/generateId';
import { send } from '../send';
import { RoomMessage } from '../types';
import { sendRoomsUpdate } from '@/utils/updateRooms';

interface GamePlayer {
  playerId: string;
  name: string;
  ws: WebSocket;
}

export const activeGames: Record<string, GamePlayer[]> = {};

export const handleRoom = (ws: WebSocket, message: RoomMessage) => {
  const player = playersStorage.getByWS(ws);
  if (!player) return;

  switch (message.type) {
    case 'create_room': {
      const alreadyInRoom = roomsStorage
        .getAvailableRooms()
        .some((r) => r.users.some((u) => u.index === player.id));

      if (alreadyInRoom) {
        break;
      }

      const newRoom = roomsStorage.createRoom(player);

      if (!newRoom) {
        ws.send(
          JSON.stringify({
            type: 'error',
            data: 'Failed to create room',
            id: 0,
          }),
        );
        break;
      }

      ws.send(
        JSON.stringify({
          type: 'room_created',
          data: {
            roomId: newRoom.roomId,
            roomUsers: newRoom.users,
          },
          id: 0,
        }),
      );

      sendRoomsUpdate();
      break;
    }

    case 'add_user_to_room': {
      const { indexRoom } = message.data;

      const room = roomsStorage.getById(String(indexRoom));
      if (!room) {
        ws.send(
          JSON.stringify({
            type: 'error',
            data: 'Room not found',
            id: 0,
          }),
        );
        return;
      }

      if (!room.users.some((u) => u.index === player.id)) {
        room.users.push({ name: player.name, index: player.id });
      }

      if (room.users.length === 2) {
        const idGame = generateId();

        const gamePlayers: GamePlayer[] = room.users.map((u) => ({
          playerId: generateId(),
          name: u.name,
          ws: playersStorage.getById(u.index)!.ws!,
        }));

        activeGames[idGame] = gamePlayers;

        gamePlayers.forEach((gp) => {
          send(gp.ws, {
            type: 'create_game',
            data: { idGame, idPlayer: gp.playerId },
            id: 0,
          });
        });

        roomsStorage.remove(room.roomId);
      }

      sendRoomsUpdate();
      break;
    }
  }
};

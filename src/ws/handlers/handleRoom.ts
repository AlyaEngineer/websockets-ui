import type { WebSocket as WSWebSocket } from 'ws';
import { WSMessage, Player, RoomData } from '../types';
import { createRoom, addPlayerToRoom, getRooms, findRoomById } from '@/storage/rooms';
import { generateId } from '@/utils/generateId';
import { log } from '@/utils/log';

interface RoomRequest {
  action: 'create_room' | 'add_user_to_room';
  roomId?: string;
  player: Player;
}

export const handleRoom = (ws: WSWebSocket, message: WSMessage<RoomRequest>): void => {
  const { action, roomId } = message.data;

  const player: Player = {
    ...message.data.player,
    ws,
    sessionId: message.data.player.sessionId || generateId(),
  };

  switch (action) {
    case 'create_room': {
      createRoom(player);

      const roomsList: RoomData = {
        rooms: getRooms().map((r) => ({
          roomId: r.id,
          roomUsers: r.users.map((u) => ({ name: u.name, index: u.id })),
        })),
      };

      const response: WSMessage<RoomData> = {
        type: 'update_room',
        id: 0,
        data: roomsList,
      };

      ws.send(JSON.stringify(response));
      log(message, response);
      break;
    }

    case 'add_user_to_room': {
      if (!roomId) return;

      const success = addPlayerToRoom(roomId, player);
      if (!success) {
        console.warn(`Room with id ${roomId} not found`);
        return;
      }

      const room = findRoomById(roomId);
      if (!room) return;

      if (room.users.length === 2) {
        const idGame = generateId();
        room.users.forEach((p) => {
          const idPlayer = generateId();
          const createGameMsg: WSMessage<{ idGame: string; idPlayer: string }> = {
            type: 'create_game',
            id: 0,
            data: {
              idGame,
              idPlayer,
            },
          };
          p.ws?.send(JSON.stringify(createGameMsg));
          log(message, createGameMsg);
        });
      } else {
        const roomsList: RoomData = {
          rooms: getRooms().map((r) => ({
            roomId: r.id,
            roomUsers: r.users.map((u) => ({ name: u.name, index: u.id })),
          })),
        };

        const response: WSMessage<RoomData> = {
          type: 'update_room',
          id: 0,
          data: roomsList,
        };

        ws.send(JSON.stringify(response));
        log(message, response);
      }

      break;
    }

    default:
      console.warn('Unknown room action', action);
  }
};

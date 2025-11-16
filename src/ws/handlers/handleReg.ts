import type { WebSocket as WSWebSocket } from 'ws';
import { Player, WSMessage, RegData, RegResponseData } from '../types';
import { addPlayer, findPlayerByName } from '@/storage/players';
import { generateId } from '@/utils/generateId';
import { log } from '@/utils/log';

export const handleReg = (ws: WSWebSocket, message: WSMessage<RegData>): void => {
  const { name, password } = message.data;

  let player: Player | undefined = findPlayerByName(name);

  let response: WSMessage<RegResponseData>;

  if (player) {
    if (player.password !== password) {
      response = {
        type: 'reg',
        id: 0,
        data: {
          name,
          index: '',
          error: true,
          errorText: 'Incorrect password',
        },
      };
      ws.send(JSON.stringify(response));
      log(message, response);
      return;
    }
    player.ws = ws;
    player.sessionId = generateId();
  } else {
    const playerId = generateId();
    player = {
      id: playerId,
      name,
      password,
      wins: 0,
      sessionId: generateId(),
      ws,
    };
    addPlayer(player);
  }

  response = {
    type: 'reg',
    id: 0,
    data: {
      name: player.name,
      index: player.id,
      error: false,
    },
  };

  ws.send(JSON.stringify(response));
  log(message, response);
};

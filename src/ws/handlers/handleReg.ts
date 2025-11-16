import { WebSocket } from 'ws';
import { Player, WSMessage, RegData, RegResponseData } from '../types';
import { addPlayer, findPlayerByName } from '@/storage/players';
import { generateId } from '@/utils/generateId';
import { log } from '@/utils/log';

export const handleReg = (ws: WebSocket, message: WSMessage<RegData>): void => {
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
          playerId: '',
          error: true,
          errorText: 'Incorrect password',
        },
      };
      ws.send(JSON.stringify(response));
      log(message, response);
      return;
    }
  } else {
    const playerId = generateId();
    player = { id: playerId, name, password, wins: 0 };
    addPlayer(player);
  }

  response = {
    type: 'reg',
    id: 0,
    data: {
      name: player.name,
      playerId: player.id,
      error: false,
    },
  };

  ws.send(JSON.stringify(response));
  log(message, response);
};

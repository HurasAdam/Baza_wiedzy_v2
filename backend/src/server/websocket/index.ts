import {SOCKET_PORT } from "constants/index.js";
import Log from "simpl-loggar";
import { WebSocketServer,WebSocket } from "ws";

// let users:WebSocket[]=[];
// let heartbeat: NodeJS.Timer | undefined=undefined;

let server:WebSocketServer | undefined =undefined;

export default function(){
   
init();

}



function close(): void {
    if (server) {
      server.close();
    }
    // users.forEach((u) => {
    //   u.clients.forEach((c) => {
    //     c.close(1000, JSON.stringify(new errors.InternalError()));
    //     userDisconnected(c);
    //   });
    // });
  }

 function init(): void {
    server =  new WebSocketServer({
        port: parseInt(SOCKET_PORT)
      });

    Log.log('Socket', `Started socket on port ${SOCKET_PORT}`);
    startListeners();
    startHeartbeat();
  }

  function errorWrapper(callback: () => void, ws: WebSocket): void {
    try {
      callback();
    } catch (err) {
      handleError(err as Error, ws);
    }
  }
 function startHeartbeat(): void {
    // heartbeat = setInterval(() => {
    //   users.forEach((u) =>
    //     u.clients.forEach((c) => {
    //       if (u.retry >= 10) {
    //         Log.warn('Websocket', `Client ${u.userId} not responding. Disconnecting`);
    //         userDisconnected(c);
    //       } else {
    //         u.retry++;
    //         c.ping();
    //       }
    //     }),
    //   );
    // }, 5000);

  }

  function userDisconnected(_ws:WebSocket ): void {
    // if (!ws.userId) return;
    // users = users.filter((u) => {
    //   return u.userId !== ws.userId;
    // });
    console.log("User disconected")
  }

//   function ping(ws:unknown): void {
//     ws.pong();
//   }

//   function pong(ws:unknown): void {
//     const index = users.findIndex((u) => u.userId === ws.userId);
//     if (index < 0) {
//       Log.error('Websocket', 'Received ping from connection, which is not registered in users object');
//     } else {
//       users[index]!.retry = 0;
//     }
//   }

  function handleServerError(err: Error): void {
    const error = err as Error;
    Log.error('Socket', error.message, error.stack);
    close();
  }

  function handleUserMessage(mess: string, ws: WebSocket): void {
    let message:Record<string, string> = {};

    

    try {
      message = JSON.parse(mess) as Record<string, string>;
    } catch (_err) {
      return handleError(new Error("Not json body"), ws);
    }

    Log.log('Socket', 'Got new message', message);

    // switch (message.target) {
    //   case enums.ESocketTargets.Chat:
    //     return router.handleChatMessage(message as types.ISocketInMessage, ws);
    //   default:
    //     return router.handleError(new errors.IncorrectTargetError(), ws);
    // }

  }

function handleError(e:Error, _ws:WebSocket){
console.log(e)
}

  function onUserConnected(ws:WebSocket, _cookies: string | undefined): void {
    // preValidateUser(ws, { cookies })
    //   .then(() => {
        ws.on('message', (message: string) => errorWrapper(() => handleUserMessage(message, ws), ws));
        // ws.on('ping', () => errorWrapper(() => ping(ws), ws));
        // ws.on('pong', () => errorWrapper(() => pong(ws), ws));
        ws.on('error', (error) => handleError(error as Error, ws));
        ws.on('close', () => userDisconnected(ws));
    //   })
    //   .catch((err) => {
    //     Log.error('Websocket', "Couldn't validate user token", (err as Error).message, (err as Error).stack);
    //     ws.close(
    //       1000,
    //       JSON.stringify({
    //         type: enums.ESocketType.Error,
    //         payload: new errors.UnauthorizedError(),
    //       }),
    //     );
    //   });
  }

  function startListeners(): void {
    server!.on('connection', (ws, req) => {
      errorWrapper(() => onUserConnected(ws, req.headers.cookie), ws);
    });
    server!.on('error', (err) => handleServerError(err));
    server!.on('close', () => Log.log('Websocket', 'Server closed'));
  }





//   function sendToUser(userId: string, payload: unknown): void {
//     const formatted: Record<string, string> = {};
//     const target = users.find((e) => {
//       return e.userId === userId;
//     });

//     if (target) target.clients.forEach((c) => c.send(JSON.stringify(formatted)));
//   }


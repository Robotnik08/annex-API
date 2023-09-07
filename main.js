import { Middleware } from './includes/middleware.mjs';
import { getResponse } from './includes/getResult.mjs';
import { Server } from './includes/server.mjs';

const server = new Server(80);

// middleware initialization
const middleware = new Middleware();
server.subscribeToUSEPath('/', middleware.handler);

server.subscribeToGET('/', getResponse);

// start the server after subscribing to requests
server.start();
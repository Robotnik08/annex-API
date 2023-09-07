import { Server } from './includes/server.mjs';

const server = new Server(80);


// start the server after subscribing to requests
server.start();
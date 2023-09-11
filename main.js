/**
 * @fileoverview This file is the entry point of the application.
 * This code was written by Pulllee Inc.
 */

import { Middleware } from './includes/middleware.mjs';
import { ResponseHandler } from './includes/getResult.mjs';
import { Server } from './includes/server.mjs';

// server initialization
const server = new Server(80);

// middleware initialization
const middleware = new Middleware();
server.subscribeToUSEPath('/', middleware.handler);

// response handler initialization
const responseHandler = new ResponseHandler();
server.subscribeToGET('/', responseHandler.handler);

// start the server after subscribing to requests
server.start();
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';

const options = {
    cert: fs.readFileSync("PATH_TO_KEY"),
    key: fs.readFileSync("PATH_TO_CERTIFICATE"),
    ca: fs.readFileSync("PATH_TO_CA")
};
export class Server {

    // Private fields
    #expressApp;
    #server;
    #port;

    /**
     * Creates a new server instance.
     * @param {number} port - The port on which the server should listen.
     * @param {boolean} https - Whether to use HTTPS (default: false).
     */
    constructor(port, _https = false) {
        this.#expressApp = express();
        if (!_https) {
            this.#server = http.createServer(this.#expressApp);
            this.#port = port;
        } else {
            this.#server = https.createServer(this.#expressApp, options);
            this.#port = 443;
        }
    }

    // getters and setters

    /**
     * Gets the port on which the server is configured to listen.
     */
    get port() {
        return this.#port;
    }

    /**
     * Sets the port on which the server should listen.
     * @param {number} port - The new port value.
     */
    set port(port) {
        this.#port = port;
    }

    /**
     * Start the server with the specified port.
     */
    start() {
        this.#server.listen(this.#port, () => {
            console.log(`Server is listening on port ${this.#port}`);
        });

        this.#server.on('error', (error) => {
            console.error(`Server failed to start: ${error.message}`);
        });
        this.#server.on('close', () => {
            console.log('Server stopped listening');
        });
    }

    /**
     * Subscribe to a GET request. The handler will be called when a GET request is made to the specified path.
     * @param {string} path - The path to subscribe to.
     * @param {function} handler - The handler function to call when the path is requested. Handler signature: (req, res) => void
     */
    subscribeToGET(path, handler) {
        this.#expressApp.get(path, handler);
    }
    /**
     * Subscribe to a POST request. The handler will be called when a POST request is made to the specified path.
     * @param {string} path - The path to subscribe to.
     * @param {function} handler - The handler function to call when the path is requested. Handler signature: (req, res) => void
     */
    subscribeToPOST(path, handler) {
        this.#expressApp.post(path, handler);
    }
    /**
     * Subscribe to a PUT request. The handler will be called when a PUT request is made to the specified path.
     * @param {string} path - The path to subscribe to.
     * @param {function} handler - The handler function to call when the path is requested. Handler signature: (req, res) => void
     */
    subscribeToPUT(path, handler) {
        this.#expressApp.put(path, handler);
    }
    /**
     * Subscribe to a DELETE request. The handler will be called when a DELETE request is made to the specified path.
     * @param {string} path - The path to subscribe to.
     * @param {function} handler - The handler function to call when the path is requested. Handler signature: (req, res) => void
     */
    subscribeToDELETE(path, handler) {
        this.#expressApp.delete(path, handler);
    }
    /**
     * Subscribe to middleware. The handler will be called when any request is made to the specified path.
     * @param {string} path - The path to subscribe to.
     * @param {function} handler - The handler function to call when the path is requested. Handler signature: (req, res) => void
     */
    subscribeToUSEPath(path, handler) {
        this.#expressApp.use(path, handler);
    }
    /**
     * Subscribe to middleware. The handler will be called when any request is made to the api.
     * @param {function} handler - The handler function to call when the path is requested. Handler signature: (req, res) => void
     */
    subscribeToUSE(handler) {
        this.#expressApp.use(handler);
    }
}
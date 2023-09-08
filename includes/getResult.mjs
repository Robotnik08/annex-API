/**
 * @file getResult.mjs
 * @description This file contains the template for the root function for the result.
 * @module ResponseHandler
 */

// root function for the result
export class ResponseHandler {
    handler (req, res, next) {
        // get the result from the request and send it back to the client, implement in the future
        res.json({
            result: "Hello World!"
        }); // send an empty JSON object
    }
}
/**
 * @file middleware.mjs
 * @description This file handles middleware, API key checking, and other things that need to be done before the request is handled. catch bad requests here.
 * @module Middleware
 */

export class Middleware {
    handler(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); // wild card
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET'); // only allow GET requests for REST API
        next();
    }
}
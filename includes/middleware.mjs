/**
 * @file middleware.mjs
 * @description This file handles middleware, API key checking, and other things that need to be done before the request is handled. catch bad requests here.
 * @module Middleware
 */
import { KeyManager } from "./key.mjs";
import { RateLimiter } from "./ratelimit.mjs";

const keyManager = new KeyManager();
const rateLimiter = new RateLimiter();


export class Middleware {
    handler(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); // wild card
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET'); // only allow GET requests for REST API
        
        const key = req.headers.authorization;
        if (!keyManager.checkKey(key)) {
            res.status(401).json({error: 'Unauthorized api key. Forbidden.'});
            return; 
        } else if (!rateLimiter.checkKey(key)) {
            res.status(429).json({error: 'Too many requests. Please try again later. (Next hour)'});
            return;
        }

        next();
    }
}
/**
 * @file key.mjs
 * @description This file handles API key generation.
 * @module KeyGenerator
 */

import { promises as fsPromises, existsSync } from 'fs';
import * as fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// file urls
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @class KeyGenerator
 * @description This class generates API keys, 32 characters long.
 * @module KeyGenerator
 */
export class KeyGenerator {
    #characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    generateKey() {
        let key = '';
        for (let i = 0; i < 32; i++) {
            key += this.#characters[(Math.random() * this.#characters.length)|0];
        }
        return key;
    }
}

/**
 * @file key.mjs
 * @description This file handles API key management.
 * @module KeyManager
 */
export class KeyManager {
    #keys = [];

    constructor() {
        this.#loadKeys();
    }
    addKey(key) {
        this.#keys.push(key);
        this.#saveKeys();
    }

    removeKey(key) {
        this.#keys = this.#keys.filter(k => k !== key);
        this.#saveKeys();
    }

    checkKey(key) {
        return this.#keys.includes(key);
    }

    #loadKeys() {
        fs.readFile(join(__dirname, '../data/keys.json'), 'utf-8', (error, data) => {
            const result = JSON.parse(data).keys;
            for (const key of result) {
                this.#keys.push(key);
            }
        });
    }

    #saveKeys() {
        fsPromises.writeFile(join(__dirname, '../data/keys.json'), JSON.stringify({keys: this.#keys}));
    }
}
/**
 * @fileoverview This file contains the API key for the OpenWeatherMap API.
 * @module API_KEY
 * 
*/

import * as fs from 'fs';
import * as path from 'path';

const __dirname = path.resolve();
export const API_KEY = JSON.parse(getConfig()).api_key;

function getConfig() {
    const apiKeyPath = path.join(__dirname, 'config.json');
    try {
        return fs.readFileSync(apiKeyPath, {encoding: 'utf-8'});
    } catch (error) {
        console.error(`Failed to read Config from ${apiKeyPath}: ${error.message}`);
        process.exit(1);
    }
}
/**
 * @file addkey.js
 * @description This file is used to add a key to the keys.json file.
 * This code was written by Pulllee Inc.
 */

import { KeyGenerator } from "./includes/key.mjs";
import { KeyManager  } from "./includes/key.mjs";

const keyManager = new KeyManager();
const keyGenerator = new KeyGenerator();

let key = keyGenerator.generateKey();
while (keyManager.checkKey(key)) {
    key = keyGenerator.generateKey();
}
setTimeout(() => {
    keyManager.addKey(key);
    console.log(`Key generated: ${key}`);
}, 1000);
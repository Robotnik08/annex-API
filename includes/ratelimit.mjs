const MAX_REQUESTS_PER_HOUR = 10000;

export class RateLimiter {
    #requests;
    #lastHour;

    constructor() {
        this.#requests = {};
        this.#lastHour = new Date().getHours();
    }

    checkKey(key) {
        if (!this.#requests[key]) this.#requests[key] = 0;
        if (this.#lastHour !== new Date().getHours()) {
            for (const key in this.#requests) {
                this.#requests[key] = 0;
            }
            this.#lastHour = new Date().getHours();
        }
        this.#requests[key]++;
        return this.#requests[key] <= MAX_REQUESTS_PER_HOUR;
    }
}
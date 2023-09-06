import express from 'express';
import http from 'http';
const app = express();
const server = http.createServer(app);
const port = 80;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
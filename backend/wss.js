import WebSocket from 'ws';
import * as fs from "fs";

const wss = new WebSocket.Server({ port: 8080 });

const clients = []

wss.on('connection', function connection(ws) {

    fs.watch("db.json", (data) => {
        ws.send('update')
    })

    
});
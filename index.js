const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// app.use(express.json);


function formatarDataHora(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

app.get('/send-data', (req, res) => {
    const equipId = req.query.equipid;
    const temperatura = req.query.temp;
    const estadoPorta = req.query.door;

    const data = {
        equipId,
        temperatura,
        estadoPorta,
        timestamp: formatarDataHora(new Date())
    };

    wss.clients.forEach((client) => {
        client.send(JSON.stringify(data));
    });
    console.log(req.query)
    res.status(200).send();
});

// app.post('/post-data', (req, res) => {
//     console.log(req.body)
//     const { equipId, temp, door } = req.body;
//     const data = {
//         equipId,
//         temp,
//         door,
//         timestamp: formatarDataHora(new Date())
//     };

//     wss.clients.forEach((client) => {
//         client.send(JSON.stringify(data));
//     });

//     console.log(req.body);
//     res.status(200).send();
// });

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

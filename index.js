const express = require('express');
const http = require('http');
const WebSocket = require('ws');
//const db = require('./db');
const pgdb = require('./postgresql.js');
const app = express();
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// async function testePG() {
//     await pgdb.insertData('branch', { id: 5, idcompany: 2, name: 'teste cu testese' });
//     const data = await pgdb.getBranchesByCompany(2);
//     console.log(data)
// }

// testePG()

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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

app.get('/get-company', async (req, res) => {
    const data = await pgdb.getAllCompanies();
    res.status(200).send(data);
});

app.get('/get-branch', async (req, res) => {
    const data = await pgdb.getBranchesByCompany(req.query.idcompany);
    res.status(200).send(data);
});

app.get('/get-department', async (req, res) => {
    const data = await pgdb.getDepartmentsByBranch(req.query.idbranch);
    res.status(200).send(data);
});

app.get('/get-panel', async (req, res) => {
    const data = await pgdb.getPanelsByDepartment(req.query.iddepartment);
    res.status(200).send(data);
});

app.get('/get-sensor', async (req, res) => {
    const data = await pgdb.getAllSensors();
    res.status(200).send(data);
});

app.get('/get-sensortype', async (req, res) => {
    const data = await pgdb.getAllSensorTypes();
    res.status(200).send(data);
});

app.get('/get-table-company', async (req, res) => {
    const data = await pgdb.getAllCompanies();
    const header = [
        { name: "id", title: "Id", sortable: true, size: 100 },
        { name: "name", title: "Nome", sortable: true }
    ];
    const response = { header, data };
    res.status(200).send(response);
});

app.get('/get-table-branch', async (req, res) => {
    const data = await pgdb.getBranchesByCompany(req.query.idcompany);
    const header = [
        { name: "id", title: "Id", sortable: true, size: 100 },
        { name: "name", title: "Nome", sortable: true }
    ];
    const response = { header, data };
    res.status(200).send(response);
});

app.get('/get-table-department', async (req, res) => {
    const data = await pgdb.getDepartmentsByBranch(req.query.idbranch);
    const header = [
        { name: "id", title: "Id", sortable: true, size: 100 },
        { name: "name", title: "Nome", sortable: true }
    ];
    const response = { header, data };
    res.status(200).send(response);
});

app.get('/get-table-panel', async (req, res) => {
    const data = await pgdb.getPanelsByDepartment(req.query.iddepartment);
    const header = [
        { name: "id", title: "Id", sortable: true, size: 100 },
        { name: "name", title: "Nome", sortable: true }
    ];
    const response = { header, data };
    res.status(200).send(response);
});

app.get('/get-table-sensortype', async (req, res) => {
    const data = await pgdb.getAllSensorTypes();
    const header = [
        { name: "id", title: "Id", sortable: true, size: 100 },
        { name: "name", title: "Nome", sortable: true }
    ];
    const response = { header, data };
    res.status(200).send(response);
});

app.get('/get-table-sensor', async (req, res) => {
    const data = await pgdb.getSensorsByType(req.query.sensorTypeId);
    const header = [
        { name: "id", title: "Id", sortable: true, size: 100 },
        { name: "name", title: "Nome", sortable: true },
        { name: "model", title: "Modelo", sortable: true },
        { name: "partnumber", title: "Part Number", sortable: true }
    ];
    const response = { header, data };
    res.status(200).send(response);
});

app.get('/get-table-parameter', async (req, res) => {
    try {
        const data = await pgdb.getMonitorParamenters(req.query.panelid);
        const header = [
            { name: "id", title: "Id", sortable: true, size: 100 },
            { name: "name", title: "Nome", sortable: true },
            { name: "device", title: "Dispositivo", sortable: true },
            { name: "minvalue", title: "Valor Mínimo", sortable: true },
            { name: "maxvalue", title: "Valor Máximo", sortable: true }
        ];
        const response = { header, data };
        res.status(200).send(response);
    } catch (error) {
        console.log(error)
    }
});

app.post('/post-company', async (req, res) => {
    const { id, name, isdeleted } = req.body;
    const data = {
        id: id,
        name: name.toUpperCase(),
        isdeleted: isdeleted
    }
    const returnId = await pgdb.insertData('company', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-branch', async (req, res) => {
    const { id, idcompany, name, isdeleted } = req.body;
    const data = {
        id: id,
        idcompany: idcompany,
        name: name.toUpperCase(),
        isdeleted: isdeleted
    }
    const returnId = await pgdb.insertData('branch', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-department', async (req, res) => {
    const { id, idbranch, name, isdeleted } = req.body;
    const data = {
        id: id,
        idbranch: idbranch,
        name: name.toUpperCase(),
        isdeleted: isdeleted
    }
    const returnId = await pgdb.insertData('department', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-panel', async (req, res) => {
    const { id, iddepartment, name, isdeleted } = req.body;
    const data = {
        id: id,
        iddepartment: iddepartment,
        name: name.toUpperCase(),
        isdeleted: isdeleted
    }
    const returnId = await pgdb.insertData('panel', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-sensortype', async (req, res) => {
    const { id, name, isdeleted } = req.body;
    const data = {
        id: id,
        name: name.toUpperCase(),
        isdeleted: isdeleted
    }
    const returnId = await pgdb.insertData('sensortype', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-sensor', async (req, res) => {
    const { id, idtypesensor, name, model, partnumber, isdeleted } = req.body;
    const data = {
        id: id,
        idsensortype: idtypesensor,
        name: name.toUpperCase(),
        model: model.toUpperCase(),
        partnumber: partnumber,
        isdeleted: isdeleted
    }
    const returnId = await pgdb.insertData('sensor', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-parameter', async (req, res) => {
    const { id, idpanel, idsensor, name, minvalue, maxvalue, isdeleted } = req.body;
    const data = {
        id: id,
        idpanel: idpanel,
        idsensor: idsensor,
        name: name,
        minvalue: minvalue,
        maxvalue: maxvalue,
        isdeleted: isdeleted
    }
    console.log(data)
    const returnId = await pgdb.insertData('sensorpanel', data);
    const ret = {
        id: returnId
    }
    return res.status(200).send(ret);
});

app.post('/post-data', (req, res) => {
    console.log(req.body)
    const { equipId, temp, door } = req.body;
    const data = {
        equipId,
        temp,
        door,
        timestamp: formatarDataHora(new Date())
    };

    const dt = {
        iddevice: data.equipId,
        valuesensor: data.temp
    };

    pgdb.insertData('monitor', dt)

    wss.clients.forEach((client) => {
        client.send(JSON.stringify(data));
    });

    res.status(200).send();
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

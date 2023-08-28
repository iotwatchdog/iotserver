const mysql1 = require('mysql');
const mysql2 = require('mysql2/promise');

//#region Init MySQL
const conn1 = mysql1.createPool({
    connectionLimit: 8,
    host: "sql9.freemysqlhosting.net",
    port: "3306",
    user: 'sql9642918',
    password: 'finuyvHsTq', //a112030z
    database: "sql9642918",
    charset: 'utf8mb4'
});

const conn2 = mysql2.createPool({
    connectionLimit: 8,
    host: "sql9.freemysqlhosting.net",
    port: "3306",
    user: 'sql9642918',
    password: 'finuyvHsTq',
    database: "sql9642918",
    charset: 'utf8mb4'
});

//#endregion


async function insertData(table, data) {
    try {
        if (data.id === undefined || data.id === null || data.id === '') {
            delete data.id
            const insertSql = `INSERT INTO ${table} SET ?`;
            return new Promise((resolve, reject) => {
                conn1.query(insertSql, [data], (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        console.error(`Error on inserting in table ${table}. Detail: ${table === 'chat' ? data.displayMessage : 'outro'}`);
                        reject(err);
                    } else {
                        console.log(`1 row inserted in table ${table}!`);
                        resolve(results.insertId);
                    }
                });
            });
        } else {
            const updateSql = `UPDATE ${table} SET ? WHERE id = ?`;
            return new Promise((resolve, reject) => {
                conn1.query(updateSql, [data, data.id], (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        console.error(`Error on updating in table ${table}. Id: ${data.id}`);
                        reject(err);
                    } else {
                        if (results.affectedRows === 1) {
                            console.log(`Row updated in table ${table}!`);
                        }
                        resolve(results);
                    }
                });
            });
        }
    } catch (err) {
        console.error(`Error on insertOrUpdate at ${table} ---> ${err}`);
        throw err;
    }
    // try {
    //     const sql = `INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ${getUpdateString(data)}`;
    //     return new Promise((resolve, reject) => {
    //         conn1.query(sql, [data], (err, results, fields) => {
    //             if (err) {
    //                 console.error(err);
    //                 console.error(`Error on inserting in table ${table}. Id: ${data.id} Detail: ${table === 'chat' ? data.displayMessage : 'outro'}`);
    //                 reject(err); // Rejeita a promessa em caso de erro
    //             } else {
    //                 if (results.affectedRows === 1) {
    //                     console.log(`1 row inserted in table ${table}!`);
    //                     resolve(results.insertId);
    //                 } else {
    //                     console.log(`Row updated in table ${table}!`);
    //                 }
    //                 resolve(results); // Resolve a promessa em caso de sucesso
    //             }
    //         });
    //     });
    // } catch (err) {
    //     console.error(`Error on insert at ${table} ---> ${err}`);
    //     throw err; // Relança o erro para que possa ser capturado por quem chama a função
    // }
}

async function getAllCompanies() {
    const sql = `
        SELECT A.id,
               A.name
          FROM company A
         WHERE A.isdeleted = 0
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getAllSensorTypes() {
    const sql = `
        SELECT A.id,
               A.name
          FROM typesensor A
         WHERE A.isdeleted = 0
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getAllSensors() {
    const sql = `
        SELECT A.id,
               A.name
          FROM sensor A
         WHERE A.isdeleted = 0
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getBranchesByCompany(pIdCompany) {
    var sql = `
        SELECT A.id,
               A.name
          FROM branch A
         WHERE A.isdeleted = 0
           AND A.idcompany = ?
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql, [pIdCompany]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getDepartmentsByBranch(pIdBranch) {
    var sql = `
        SELECT A.id,
               A.name
          FROM department A
         WHERE A.isdeleted = 0
           AND A.idbranch = ?
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql, [pIdBranch]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getPanelsByDepartment(pIdDepartment) {
    var sql = `
        SELECT A.id,
               A.name
          FROM panel A
         WHERE A.isdeleted = 0
           AND A.iddepartment = ?
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql, [pIdDepartment]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getAllNamesChanged() {
    const sql = `
        SELECT authorChannelId, 
               otherNames
          FROM changednames
      ORDER BY otherNames`;
    try {
        const [rows] = await conn2.execute(sql);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getSensorsByType(pIdSensorType) {
    var sql = `
        SELECT A.id,
               A.name,
               A.model,
               A.partnumber
          FROM sensor A
         WHERE A.isdeleted = 0
           AND A.idtypesensor = ?
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql, [pIdSensorType]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getMonitorParamenters(pIdPanel) {
    var sql = `
        SELECT A.id,
               A.name,
               A.minvalue,
               A.maxvalue
          FROM sensorpanel A
         WHERE A.isdeleted = 0
           AND A.idpanel = ?
      ORDER BY 1`;
    try {
        const [rows] = await conn2.execute(sql, [pIdPanel]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getVips() {
    const sql = `
        SELECT authorChannelId, 
               icon
          FROM vip`;
    try {
        const [rows] = await conn2.execute(sql);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getAuthorsByLiveId(pParam) {
    const param = pParam.map(id => `'${id}'`).join(',');
    var sql = `
        SELECT displayName,
               authorChannelId,
               isChatModerator, 
               isChatOwner, 
               isChatSponsor,
               count(*) qtd
          FROM chat
         WHERE liveId IN (${param}) 
      GROUP BY displayName,
               authorChannelId,
               isChatModerator, 
               isChatOwner, 
               isChatSponsor
      ORDER BY displayName`;
    try {
        const [rows] = await conn2.execute(sql);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getMessagesByLiveAuthor(pLiveId, pAuthorId) {
    const liveId = pLiveId.map(id => `'${id}'`).join(',');
    let authorId = pAuthorId ? pAuthorId.map(id => `'${id}'`).join(',') : '';
    let pAuthorIdParam = pAuthorId ? ` AND authorChannelId in (${authorId})` : '';
    var sql = `
        SELECT * 
          FROM chat
         WHERE liveId IN (${liveId}) 
               ${pAuthorIdParam}
      ORDER BY publishedAt`;
    try {
        const [rows] = await conn2.execute(sql);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

function getUpdateString(data) {
    let updateString = '';
    Object.keys(data).forEach((key, index) => {
        if (index !== 0) {
            updateString += ', ';
        }
        updateString += `${key} = VALUES(${key})`;
    });
    return updateString;
}



async function getLive(pId) {
    const sql = `
        SELECT *
          FROM live
         WHERE id = ?`;
    try {
        const [rows] = await conn2.execute(sql, pId);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getChannel(pId) {
    const sql = `
        SELECT *
          FROM channel
         WHERE id = ?`;
    try {
        const [rows] = await conn2.execute(sql, pId);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getAllChannels() {
    const sql = `
        SELECT *
          FROM channel
         WHERE id NOT IN ('UCWZoPPW7u2I4gZfhJBZ6NqQ', 'UCTG_mtj3lWaEVTAiVCtZ-BA', 'UC3LlvFy-cUmUbqn3Tf7uOvg', 'UC5NJFaSrBg2sFX-bTBUtrCg')
           -- AND id = 'UCPQNcicjqVZca6hEHoim21Q'
      ORDER BY title`;
    try {
        const [rows] = await conn2.execute(sql);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getLivesWithTotalMsg() {
    const sql = `
    SELECT a.id, 
           c.title channel,
           a.title video, 
           a.publishedAt,
           COUNT(b.id) qtd
      FROM live a
      JOIN channel c
        ON c.id = a.channelId
      LEFT JOIN chat B
        ON B.liveId = a.id
     WHERE a.channelid = 'UCcKS4egjD7XiyNIzKq8-uwQ'
  GROUP BY a.id, c.title, a.title
  ORDER BY 2, 3`;
    try {
        const [rows] = await conn2.execute(sql);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function getLiveWithTotalMsg(pId) {
    const sql = `
    SELECT a.id, 
           a.title video,
           a.ischatavailable,
           a.ischecked,
           COUNT(b.id) qtd
      FROM live a
      LEFT JOIN chat B
        ON B.liveId = a.id
        WHERE a.id = ?
     GROUP BY a.id, a.title, a.ischatavailable, a.ischecked`;
    try {
        const [rows] = await conn2.execute(sql, [pId]);
        return JSON.stringify(rows[0]);
    } catch (error) {
        throw error;
    }
}

async function getCheckedLivesByChannel(pChannelId) {
    const sql = `
    SELECT a.id, 
           a.title video,
           a.ischatavailable,
           a.ischecked
      FROM live a
        WHERE a.ischecked = 1
          AND a.publishedAt <= DATE_SUB(sysdate(), INTERVAL 5 DAY)
          AND a.channelid = ?`;
    try {
        const [rows] = await conn2.execute(sql, [pChannelId]);
        return JSON.stringify(rows);
    } catch (error) {
        throw error;
    }
}

async function setLiveNotAvailable(pId) {
    try {
        const sql = `
        UPDATE live 
           SET isChatAvailable = 0 
         WHERE id = ?`;
        conn1.query(sql, [pId], (err, results, fields) => {
            if (err) {
                console.error(err);
                console.error(`Error on updating in table live. Id: ${pId}`);
            } else {
                if (results.affectedRows === 1) {
                    //console.log(`1 row inserted in table ${table}!`);
                } else {
                    console.log(`Row updated in table live!`);
                }
            }
        });
    } catch (err) {
        console.error(`Error on update at live ---> ${pId}`)
    }
}

async function setLiveIsChecked(pId) {
    try {
        const sql = `
        UPDATE live 
           SET isChecked = 1 
         WHERE id = ?`;
        conn1.query(sql, [pId], (err, results, fields) => {
            if (err) {
                console.error(err);
                console.error(`Error on updating in table live. Id: ${pId}`);
            } else {
                if (results.affectedRows === 1) {
                    //console.log(`1 row inserted in table ${table}!`);
                } else {
                    console.log(`Row updated in table live!`);
                }
            }
        });
    } catch (err) {
        console.error(`Error on update at live ---> ${pId}`)
    }
}


module.exports = {
    getAllCompanies,
    getBranchesByCompany,
    getDepartmentsByBranch,
    getAllSensorTypes,
    getPanelsByDepartment,
    getSensorsByType,
    getAllSensors,
    getMonitorParamenters,
    // getAllLives,
    // getAllNamesChanged,
    // getAuthorsByLiveId,
    // getMessagesByLiveAuthor,
    // getVips,
    // getLivesWithTotalMsg,
    //insertChat,
    insertData,
    // getAllChannels,
    // getLiveWithTotalMsg,
    // setLiveNotAvailable,
    // setLiveIsChecked,
    // getCheckedLivesByChannel
};
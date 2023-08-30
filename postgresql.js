const { Pool } = require('pg'); // Pacote para conexão com o banco de dados PostgreSQL

// Configurações da conexão com o banco de dados
const connectionString = "postgres://iotls_user:MUkDAKSK8SO1bIDVQg7HgYx0DsBw1xPF@oregon-postgres.render.com/iotls?ssl=true";
const pool = new Pool({ connectionString });

async function getAllCompanies() {
    const sql = `
        SELECT id,
               name
          FROM company
         WHERE isdeleted = 0
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}


async function getAllSensorTypes() {
    const sql = `
        SELECT A.id,
               A.name
          FROM sensortype A
         WHERE A.isdeleted = 0
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql);
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
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getBranchesByCompany(pIdCompany) {
    const sql = `
        SELECT A.id,
               A.name
          FROM branch A
         WHERE A.isdeleted = 0
           AND A.idcompany = $1
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql, [pIdCompany]);
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
           AND A.idbranch = $1
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql, [pIdBranch]);
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
           AND A.iddepartment = $1
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql, [pIdDepartment]);
        return rows;
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
           AND A.idsensortype = $1
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql, [pIdSensorType]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getMonitorParamenters(pIdPanel) {
    var sql = `
        SELECT A.id,
               A.name,
               B.name device,
               C.name sender,
               A.minvalue,
               A.maxvalue
          FROM sensorpanel A
          JOIN sensor B 
            ON B.id = A.idsensor
          JOIN sensor C
            ON C.id = A.idsender
         WHERE A.isdeleted = 0
           AND A.idpanel = $1
      ORDER BY id`;
    try {
        const { rows } = await pool.query(sql, [pIdPanel]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function insertData(table, data) {
    try {
        if (!data.id) {
            delete data.id;
            const columns = Object.keys(data);
            const values = Object.values(data);

            let placeholders = [];

            for (let i = 1; i <= values.length; i++) {
                placeholders.push(`$${i}`);
            }
            const insertQuery = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING id`;
            const { rows } = await pool.query(insertQuery, values);
            console.log(`1 row inserted in table ${table}!`);
            return rows[0].id;
        } else {
            const columns = Object.keys(data).filter(column => column !== 'id');
            const values = Object.values(data).filter((_, index) => index !== 0);
            const setExpressions = columns.map((col, i) => `${col} = $${i + 1}`);
            values.push(data.id);
            const updateQuery = `UPDATE ${table} SET ${setExpressions.join(', ')} WHERE id = $${values.length}`;
            const { rowCount } = await pool.query(updateQuery, values);
            if (rowCount === 1) {
                console.log(`Row updated in table ${table}!`);
            }
            return rowCount;
        }
    } catch (err) {
        console.error(`Error on insertOrUpdate at ${table} ---> ${err}`);
        throw err;
    }
}


// async function insertData(table, data) {
//     try {
//         if (data.id === undefined || data.id === null || data.id === '') {
//             delete data.id;
//             const insertQuery = `INSERT INTO ${table} ($1) VALUES ($1) RETURNING id`;
//             const insertValues = [data];
//             const { rows } = await pool.query(insertQuery, insertValues);
//             console.log(`1 row inserted in table ${table}!`);
//             return rows[0].id;
//         } else {
//             const updateQuery = `UPDATE ${table} SET $1:name WHERE id = $2 RETURNING *`;
//             const updateValues = [data, data.id];
//             const { rowCount } = await pool.query(updateQuery, updateValues);
//             if (rowCount === 1) {
//                 console.log(`Row updated in table ${table}!`);
//             }
//             return rowCount;
//         }
//     } catch (err) {
//         console.error(`Error on insertOrUpdate at ${table} ---> ${err}`);
//         throw err;
//     }
// }

module.exports = {
    insertData,
    getAllCompanies,
    getBranchesByCompany,
    getDepartmentsByBranch,
    getAllSensorTypes,
    getPanelsByDepartment,
    getSensorsByType,
    getAllSensors,
    getMonitorParamenters
    //getAllLives,
    // getAllNamesChanged,
    // getAuthorsByLiveId,
    // getMessagesByLiveAuthor,
    // getVips,
    // getLivesWithTotalMsg,
    //insertChat,
    // getAllChannels,
    // getLiveWithTotalMsg,
    // setLiveNotAvailable,
    // setLiveIsChecked,
    // getCheckedLivesByChannel
};
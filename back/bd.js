const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.getConnection((error, connection) => {
    if (error) {
        console.error('Não foi possível conectar ao banco de dados:', error.message);
        return;
    }
    connection.release();
});

module.exports = connection;

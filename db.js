const mysql = require('mysql2/promise')
const config = require('./utils/config')


const pool = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    database: config.DATABASE,
    password: config.PASSWORD,
    port: config.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});


module.exports = {
    pool
}
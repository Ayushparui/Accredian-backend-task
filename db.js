const mysql = require('mysql2')
const config = require('./utils/config')


const conn = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    port: config.PORT,
    password: config.PASSWORD,
    database: config.DATABASE,
    connectTimeout: 60000
});

const connectDb = async () => {
    try {
        await conn.connect();
        console.log('Connected to MySQL Server!');
    } catch (err) {
        console.error('Error connecting to MySQL Server!');
        console.error(err);
    }
};

module.exports = {
    connectDb,
    conn
}
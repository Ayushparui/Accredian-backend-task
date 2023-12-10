require('dotenv').config()

const config = module.exports = {
    HOST : process.env.HOST,
    USER : process.env.USER,
    PORT : process.env.PORT,
    PASSWORD : process.env.PASSWORD,
    DATABASE : process.env.DATABASE,
    ORIGIN: process.env.ORIGIN,
    BASE_URL: process.env.BASE_URL 
}
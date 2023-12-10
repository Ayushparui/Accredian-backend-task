const express = require('express')
const mysql = require('mysql2')
const app = express()
const cors = require('cors')
const { connectDb, conn } = require('./db')
const authRouter = require('./routes/authentication')
const config = require('./utils/config')
require('dotenv').config()

// const config = require('./utils/config')



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    }
))


connectDb()



app.use('/auth', authRouter)

// conn.query('SELECT * FROM `acc_project`.`auth_data`', (err, results) => {
//     if (err) {
//         console.error(err);
//         // Handle the error here, e.g., send an error response to the client
//     } else {
//         // Handle the query results here, e.g., send the results to the client
//         console.log(results);
//     }
// });



const PORT = 5000


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

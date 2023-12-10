const express = require('express')
const app = express()
const cors = require('cors')
const authRouter = require('./routes/authentication')
const config = require('./utils/config')
const { pool} = require('./db')

require('dotenv').config()

// const config = require('./utils/config')




app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(
    {
        origin: 'https://accredian-frontend-task-ivory.vercel.app',
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    }
))

// const executeQuery = async () => {

// try {
//     const [results] = await pool.execute('SELECT * FROM `acc_project`.`auth_data`');
//     console.log(results);
// } catch (error) {
//     console.error(error);
//     // Handle the error here, e.g., send an error response to the client
// }
// }

// executeQuery()


app.use('/auth', authRouter)





const PORT = 5000


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

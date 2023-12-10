const express = require('express')
const { conn } = require('../db')
const router = express.Router()
const bcrypt = require('bcryptjs')



router.post('/register', async (req, res) => {
    const { username, email, password, confirmpassword } = req.body
    // console.log(req.body)

    if (password !== confirmpassword) {
        res.send({
            status: 'error',
            message: 'passwords do not match'
        })
        return
    }

   

    try {

        const hashedPassword = await bcrypt.genSalt(10)
        const secPassword = await bcrypt.hash(password, hashedPassword)


        await conn.query(
            'INSERT INTO `acc_project`.`auth_data` (`username`, `email`, `password`) VALUES (?, ?, ?);',
            [username, email, secPassword],
            function (err, results) {
                if (err) {
                    console.error(err);
                    res.send({
                        status: 'error',
                        message: 'Registration failed',
                    });
                    return;
                }
                console.log(results);
                res.send({
                    status: 'ok',
                    message: 'User registered successfully!',
                });
            }
        );
        
    } catch (error) {
        console.log(error)
    }
    
   
})


// User Login

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        res.status(400).send({
            status: 'error',
            message: 'Missing identifier or password in the request',
        });
        return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const query = isEmail
        ? 'SELECT * FROM `acc_project`.`auth_data` WHERE `email` = ?'
        : 'SELECT * FROM `acc_project`.`auth_data` WHERE `username` = ?';

    conn.query(query, [identifier], async (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                status: 'error',
                message: 'Internal Server Error',
            });
            return;
        }

        if (results.length === 0) {
            // No user found with the provided identifier
            res.status(401).send({
                status: 'error',
                message: 'Invalid credentials',
            });
        } else {
            // User found, check the password
            const user = results[0];
            try {
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (isPasswordValid) {
                    // User successfully authenticated
                    res.status(200).send({
                        status: 'ok',
                        message: 'User authenticated successfully!',
                        user,
                    });
                } else {
                    // Invalid password
                    res.status(401).send({
                        status: 'error',
                        message: 'Invalid credentials',
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({
                    status: 'error',
                    message: 'Internal Server Error',
                });
            }
        }
    });
});


module.exports = router
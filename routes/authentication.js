const express = require('express');
const { pool } = require('../db');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
        res.status(400).send({
            status: 'error',
            message: 'Passwords do not match',
        });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            'INSERT INTO `acc_project`.`auth_data` (`username`, `email`, `password`) VALUES (?, ?, ?);',
            [username, email, hashedPassword]
        );

        res.status(201).send({
            status: 'ok',
            message: 'User registered successfully!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Registration failed',
        });
    }
});

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

    try {
        const [results] = await pool.execute(query, [identifier]);

        if (results.length === 0) {
            res.status(401).send({
                status: 'error',
                message: 'Invalid credentials',
            });
        } else {
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                res.status(200).send({
                    status: 'ok',
                    message: 'User authenticated successfully!',
                    user,
                });
            } else {
                res.status(401).send({
                    status: 'error',
                    message: 'Invalid credentials',
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
});

module.exports = router;

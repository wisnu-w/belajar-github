require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors library

const app = express();
const port = 3000;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(error => {
    if (error) {
        console.error('Gagal terhubung ke database:', error);
        return;
    }
    console.log('Terhubung ke database');
});

app.get('/message', (req, res) => {
    connection.query('SELECT * FROM message', (error, results) => {
        if (error) {
            console.error('Gagal mengambil data dari database:', error);
            res.status(500).json({ error: 'Gagal mengambil data dari database' });
            return;
        }
        res.json(results);
    });
});

app.post('/send-message', (req, res) => {
    const { Nama, pesan, kehadiran } = req.body;
  
    const sql = 'INSERT INTO message (Nama, pesan, kehadiran) VALUES (?, ?, ?)';
    connection.query(sql, [Nama, pesan, kehadiran], (error, result) => {
        if (error) {
            console.error('Gagal menyimpan data ke database:', error);
            res.status(500).json({ error: 'Gagal menyimpan data ke database' });
            return;
        }
        console.log('Data berhasil disimpan:', result);
        res.status(201).json({ message: 'Data berhasil disimpan' });
    });
});

app.post('/send-gif', (req, res) => {
    const {nama, jumlah } = req.body;

    const sql_gif = 'INSERT INTO gif (Nama, jumlah) VALUE (?,?)';
    connection.query(sql_gif, [nama,jumlah], (error, result) => {
        if (error) {
            console.error('data ga masuk cuk:', error);
            res.status(500).json({ error: 'Gagal menyimpan data ke database' });
            return;
        }
        console.log('Data berhasil disimpan:', result);
        res.status(201).json({ message: 'Data berhasil disimpan' });
    });
});

app.get('/gif', (req, res) => {
    connection.query('SELECT * FROM gif', (error, results) => {
        if (error) {
            console.error('Gagal mengambil data dari database:', error);
            res.status(500).json({ error: 'Gagal mengambil data dari database' });
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server berjsasasaalan di http://localhost:${port}`);
});

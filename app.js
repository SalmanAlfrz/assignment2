const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = 3000;

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Baca file users.json
const users = JSON.parse(fs.readFileSync('users.json'));
// Baca file users.json
const teachers = JSON.parse(fs.readFileSync('teachers.json'));

// Middleware untuk parsing body dari request
app.use(express.json());

// Endpoint untuk login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Cari user yang memiliki username dan password yang cocok
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        // Jika user tidak ditemukan, kirim response error
        return res.status(401).json({ message: 'Username atau Password Salah' });
    }
    // Jika user ditemukan, buat token JWT dengan informasi user yang dienkripsi
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key');
    // Kirim response sukses dengan token JWT
    res.json({ token });
});

// Middleware untuk memeriksa token JWT
function verifyToken(token) {
    const decoded = jwt.verify(token, 'secret_key');
    return decoded;
}

// Endpoint untuk mendapatkan semua data teachers.json
app.get('/teachers', (req, res) => {
    // Ambil token dari header request
    const token = req.headers['token'];
    // Verifikasi token
    const decoded = verifyToken(token);
    // Cari user yang memiliki id yang sama dengan id yang ada di token
    const user = users.find(user => user.id === decoded.id);
    if (!user) {
        // Jika user tidak ditemukan, kirim response error
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Jika user ditemukan, kirim response sukses dengan data teachers.json
    res.json(teachers);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

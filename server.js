const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const chatFile = path.join(__dirname, 'chats', 'chat.txt');

// Login / registro simple
app.post('/login', (req, res) => {
    const { username } = req.body;
    if(!username) return res.json({ success:false, message:'Ingresa un usuario' });

    // Guardar usuario si no existe (no contraseña por simplicidad)
    res.json({ success:true });
});

// Guardar mensaje en chat.txt
app.post('/message', (req, res) => {
    const { username, message } = req.body;
    if(!username || !message) return res.json({ success:false });

    const time = new Date().toLocaleString();
    const line = `[${time}] ${username}: ${message}\n`;

    fs.appendFileSync(chatFile, line);
    res.json({ success:true });
});

// Obtener mensajes
app.get('/messages', (req, res) => {
    if(!fs.existsSync(chatFile)) {
        fs.writeFileSync(chatFile, '');
    }
    const data = fs.readFileSync(chatFile, 'utf8');
    res.send(data);
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

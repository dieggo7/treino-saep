const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, '../front')));
app.use('/api/users', require('./routes/users'));
app.use('/api/corredores', require('./routes/corredores'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/dashboard.html'));
});

module.exports = app;

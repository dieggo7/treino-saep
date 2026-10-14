const express = require('express');
const app = express();
const path = require ('path');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurar CORS 
app.use(cors({
    origin: '*',
    credentials: true
}));

//servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, '../front/build')));

//rotas da api

const userRouter = require ('./routes/userRoutes');
app.use('/api/users', userRouter);

const corredoresRouter = require ('./routes/corredoresRoutes');
app.use('/api/corredores', corredoresRouter);

//rota raiz (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front', 'login.html'));
});
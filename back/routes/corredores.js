const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// GET todos os corredores
router.get('/', (req, res) => {
    const sql = "SELECT * FROM corredores";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar corredores:', err);
            res.status(500).json({ error: 'Erro ao buscar corredores' });
        } else {
            res.json(results);
        }
    });
});

router.get('/cadastrados', (req, res) => {
    const sql = "SELECT * FROM corredores";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar corredores:', err);
            res.status(500).json({ error: 'Erro ao buscar corredores' });
        } else {
            res.json(results);
        }
    });
});


router.post('/', async (req, res) => {
    const { nome, turma, senha } = req.body;

    if (!nome || !turma || !senha) {
        return res.status(400).json({ error: 'nome, turma e senha são obrigatórios' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO corredores (nome, turma, senha) VALUES(?,?,?)";

    db.query(sql, [nome, turma, senhaHash], (err, results) => {
        if (err) {
            console.error('Erro ao criar corredor:', err);
            return res.status(500).json({ error: 'Erro ao criar corredor' });
        }

        return res.status(201).json({
            message: 'Corredor criado com sucesso',
            id: results.insertId
        });
    });
});

module.exports = router;
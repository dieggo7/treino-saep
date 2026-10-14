const express = require('express');
const router = express.Router();
const db = require('../bd');
const bcrypt = require('bcrypt');

// GET todos os corredores
router.get('/', (req, res) => {
    const sql = "SELECT id, nome, turma FROM corredores";
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
    const sql = "SELECT id, nome, turma FROM corredores";
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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, turma, senha } = req.body;

    if (!nome || !turma) {
        return res.status(400).json({ error: 'nome, turma e senha são obrigatórios' });
    }

    let sql = 'UPDATE corredores SET nome = ?, turma = ?';
    const values = [nome, turma];
    if (senha) {
        try {
            values.push(await bcrypt.hash(senha, 10));
            sql += ', senha = ?';
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao processar senha' });
        }
    }
    sql += ' WHERE id = ?';
    values.push(id);

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao atualizar corredor:', err);
            return res.status(500).json({ error: 'Erro ao atualizar corredor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Corredor não encontrado' });
        }

        res.status(200).json({ message: 'Corredor atualizado com sucesso!' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM corredores WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar corredor:', err);
            res.status(500).json({ error: 'Erro ao deletar corredor' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Corredor não encontrado' });
        } else {
            res.status(200).json({ message: 'Corredor deletado com sucesso!' });
        }
    });
});

router.get("/melhor-volta", (req, res) => {
    const sql = `
        SELECT corredores.nome, corridas.tempo
        FROM corredores, corridas
        WHERE corredores.id = corridas.corredores_id
        ORDER BY corridas.tempo ASC
        LIMIT 1
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar melhor volta:', err);
            return res.status(500).json({ error: 'Erro ao buscar melhor volta' });
        }
        res.json(results[0] || null);
    });
});

router.get("/tempo-total", (req, res) => {
    const sql = `
        SELECT corredores.nome, SUM(corridas.tempo) AS tempo_total
        FROM corredores, corridas
        WHERE corredores.id = corridas.corredores_id
        GROUP BY corredores.id, corredores.nome
        ORDER BY SUM(corridas.tempo) ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar tempo total:', err);
            return res.status(500).json({ error: 'Erro ao buscar tempo total' });
        }
        res.json(results);
    });
});

router.get("/voltas", (req, res) => {
    const sql = `
        SELECT corredores.nome, SUM(corridas.voltas) AS total_voltas
        FROM corredores, corridas
        WHERE corredores.id = corridas.corredores_id
        GROUP BY corredores.id, corredores.nome
        ORDER BY SUM(corridas.voltas) ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar quantidade de voltas:', err);
            return res.status(500).json({ error: 'Erro ao buscar quantidade de voltas' });
        }
        res.json(results);
    });
});

router.get("/ranking", (req, res) => {
    const sql = `
        SELECT corredores.id, corredores.nome, corredores.turma, SUM(corridas.tempo) AS tempo_total
        FROM corredores, corridas
        WHERE corredores.id = corridas.corredores_id
        GROUP BY corredores.id, corredores.nome, corredores.turma
        ORDER BY SUM(corridas.tempo) ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar ranking:', err);
            return res.status(500).json({ error: 'Erro ao buscar ranking' });
        }
        res.json(results);
    });
});

module.exports = router;

module.exports = router;

import { openDb } from './database.js';
import bcrypt from 'bcrypt';

export const UserController = {
    async list(req, res) {
        try {
            const db = await openDb();
            const users = await db.all(`
                SELECT u.id, u.nome, u.email, COUNT(l.id) as total_atividades
                FROM users u 
                LEFT JOIN activity_logs l ON u.id = l.user_id
                GROUP BY u.id
            `);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    },

    async create(req, res) {
        const { nome, email, senha } = req.body;
        const db = await openDb();
        try {
            const hash = await bcrypt.hash(senha, 10);
            const result = await db.run('INSERT INTO users (nome, email, senha) VALUES (?,?,?)', [nome, email, hash]);
            await db.run('INSERT INTO activity_logs (user_id, acao) VALUES (?,?)', [result.lastID, 'CADASTRO']);
            res.status(201).json({ message: "Criado!" });
        } catch (e) { res.status(400).json({ error: "E-mail duplicado" }); }
    },

    async update(req, res) {
        const { id } = req.params;
        const { nome, email } = req.body;
        const db = await openDb();
        try {
            await db.run('UPDATE users SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
            await db.run('INSERT INTO activity_logs (user_id, acao) VALUES (?,?)', [id, 'EDICAO']);
            res.json({ message: "Atualizado!" });
        } catch (e) { res.status(400).json({ error: "Erro ao atualizar" }); }
    },

    async delete(req, res) {
        const { id } = req.params;
        const db = await openDb();
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: "Removido" });
    }
};
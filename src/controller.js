import bcrypt from 'bcrypt';
import { initDb } from './database.js';

export const UserController = {
    // Criar Usuário (com Transação)
    async create(req, res) {
        const { nome, email, senha } = req.body;
        const db = await initDb();
        try {
            await db.run('BEGIN TRANSACTION');
            const hash = await bcrypt.hash(senha, 10);
            const userResult = await db.run(
                'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, hash]
            );
            await db.run(
                'INSERT INTO activity_logs (user_id, acao) VALUES (?, ?)',
                [userResult.lastID, 'CADASTRO_VIA_API']
            );
            await db.run('COMMIT');
            res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch (error) {
            await db.run('ROLLBACK');
            res.status(400).json({ error: error.message });
        }
    },

    // Listar Usuários
    async list(req, res) {
        const db = await initDb();
        const users = await db.all(`
            SELECT u.id, u.nome, u.email, COUNT(l.id) as total_atividades
            FROM users u
            LEFT JOIN activity_logs l ON u.id = l.user_id
            GROUP BY u.id
        `);
        res.json(users);
    },

    // NOVO: Ver Logs de Auditoria
    async getLogs(req, res) {
        const db = await initDb();
        const logs = await db.all(`
            SELECT l.id, u.nome as usuario, l.acao, l.data_hora
            FROM activity_logs l
            JOIN users u ON l.user_id = u.id
            ORDER BY l.data_hora DESC
        `);
        res.json(logs);
    },

    // NOVO: Deletar Usuário
    async delete(req, res) {
        const { id } = req.params;
        const db = await initDb();
        try {
            await db.run('DELETE FROM users WHERE id = ?', [id]);
            res.json({ message: "Usuário e logs removidos com sucesso!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
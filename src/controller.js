import bcrypt from 'bcrypt';
import { initDb } from './database.js';

export const UserController = {
    // Método para Criar Usuário com Transação
    async create(req, res) {
        const { nome, email, senha } = req.body;
        const db = await initDb();

        try {
            await db.run('BEGIN TRANSACTION');

            // Criptografia da senha (Segurança)
            const hash = await bcrypt.hash(senha, 10);

            // Inserção do Usuário
            const userResult = await db.run(
                'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, hash]
            );

            // Inserção do Log (Auditoria)
            await db.run(
                'INSERT INTO activity_logs (user_id, acao) VALUES (?, ?)',
                [userResult.lastID, 'USUARIO_CADASTRADO']
            );

            await db.run('COMMIT');
            res.status(201).json({ id: userResult.lastID, nome, email });
        } catch (error) {
            await db.run('ROLLBACK');
            res.status(400).json({ error: "Erro na operação: " + error.message });
        }
    },

    // Método para Listar com SQL Join
    async list(req, res) {
        const db = await initDb();
        const users = await db.all(`
            SELECT u.id, u.nome, u.email, COUNT(l.id) as total_logs
            FROM users u
            LEFT JOIN activity_logs l ON u.id = l.user_id
            GROUP BY u.id
        `);
        res.json(users);
    }
};
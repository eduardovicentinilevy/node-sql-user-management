import express from 'express';
import { UserController } from './controller.js';

const app = express();
app.use(express.json());

// Rotas de Usuários
app.post('/users', UserController.create);
app.get('/users', UserController.list);
app.delete('/users/:id', UserController.delete); // Rota com parâmetro ID

// Rota de Auditoria
app.get('/logs', UserController.getLogs);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    -------------------------------------------
    ✅ API ATUALIZADA RODANDO
    🚀 Endpoints disponíveis:
       POST   /users
       GET    /users
       GET    /logs
       DELETE /users/:id
    -------------------------------------------
    `);
});
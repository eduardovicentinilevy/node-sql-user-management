import express from 'express';
import { UserController } from './controller.js';

const app = express();
app.use(express.json()); // Permite que a API entenda JSON

// Definição das Rotas REST
app.post('/users', UserController.create); // Endpoint de Cadastro
app.get('/users', UserController.list);    // Endpoint de Listagem

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📌 Teste o GET em: http://localhost:3000/users`);
});
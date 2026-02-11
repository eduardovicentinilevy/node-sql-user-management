import express from 'express';
import cors from 'cors';
import { UserController } from './controller.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/users', UserController.list);
app.post('/users', UserController.create);
app.put('/users/:id', UserController.update);
app.delete('/users/:id', UserController.delete);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor LCS-05 rodando em http://localhost:${PORT}`);
});
import { initDb } from './database.js';
import bcrypt from 'bcrypt';

async function popularBanco() {
    const db = await initDb();
    const senhaHash = await bcrypt.hash('123456', 10);

    console.log("🌱 Populando banco de dados...");

    const pessoas = [
        ['Alice Oliveira', 'alice@email.com'],
        ['Bruno Souza', 'bruno@email.com'],
        ['Carla Peixoto', 'carla@email.com'],
        ['Diego Lima', 'diego@email.com']
    ];

    for (const [nome, email] of pessoas) {
        try {
            await db.run(
                'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, senhaHash]
            );
            console.log(`✅ Usuário ${nome} adicionado.`);
        } catch (e) {
            console.log(`⚠️ Pulei ${nome} (já deve existir).`);
        }
    }

    console.log("✨ Pronto!");
}

popularBanco();
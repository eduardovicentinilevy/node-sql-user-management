import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Ativa a verificação de chaves estrangeiras
    await db.get("PRAGMA foreign_keys = ON");

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            acao TEXT,
            data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
    return db;
}
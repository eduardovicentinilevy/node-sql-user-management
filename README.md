# 🚀 Node.js + SQL User Management API

API RESTful robusta para gestão de usuários, focada em integridade de dados e segurança. Este projeto demonstra o uso de transações SQL (ACID), auditoria automatizada e hashing de senhas.

## 🛠️ Tecnologias Utilizadas
* **Node.js** & **Express** (Engine e Framework)
* **SQLite** (Banco de dados relacional)
* **BCrypt** (Criptografia de senhas)
* **SQL Avançado** (Joins, Grupos e Transações)

## 🏗️ Arquitetura do Banco de Dados
O projeto utiliza um modelo relacional com integridade referencial (`ON DELETE CASCADE`):


## 🚦 Endpoints Disponíveis
- `POST /users`: Cria um usuário e gera log de auditoria (Transacional).
- `GET /users`: Lista usuários com contagem de atividades (SQL Join).
- `GET /logs`: Exibe histórico de auditoria do sistema.
- `DELETE /users/:id`: Remove usuário e seus respectivos logs automaticamente.

## 🧠 Diferenciais Técnicos
1. **Transações ACID**: O cadastro de usuário e a criação do log ocorrem em uma única transação. Se um falhar, o banco sofre `ROLLBACK`.
2. **Segurança**: Senhas nunca são salvas em texto plano; utilizamos Hashing com Salt.
3. **Auditoria**: Cada ação crítica gera um rastro de dados imutável.
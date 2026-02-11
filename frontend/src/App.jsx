import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' })
  const [editandoId, setEditandoId] = useState(null)

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users')
      setUsuarios(res.data)
    } catch (err) {
      console.error("Servidor offline?");
    }
  }

  useEffect(() => { fetchUsuarios() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3000/users/${editandoId}`, {
          nome: formData.nome,
          email: formData.email
        })
      } else {
        await axios.post('http://localhost:3000/users', formData)
      }
      setFormData({ nome: '', email: '', senha: '' })
      setEditandoId(null)
      fetchUsuarios()
    } catch (err) { alert("Erro ao salvar") }
  }

  return (
    <div className="container">
      <header className="header-principal">
        <h1>Gestão LCS-05</h1>
        <p>Luthieria de Dados | Dashboard Ativo</p>
      </header>
      
      <form onSubmit={handleSubmit} className={`form-cadastro ${editandoId ? 'modo-edicao' : ''}`}>
        <div className="inputs-container">
          <input placeholder="Nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
          <input placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          {!editandoId && <input type="password" placeholder="Senha" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} required />}
          <button type="submit" className="btn-cadastrar">{editandoId ? 'SALVAR' : 'CADASTRAR'}</button>
        </div>
        {editandoId && <button type="button" onClick={() => {setEditandoId(null); setFormData({nome:'',email:'',senha:''})}}>Cancelar</button>}
      </form>

      <div className="grid-usuarios">
        {usuarios.map(user => (
          <div key={user.id} className="card-usuario">
            <div className="card-header">
              <h3>{user.nome}</h3>
              <p>{user.email}</p>
            </div>
            <div className="card-footer">
              <span className="badge-atividades">LOGS: {user.total_atividades}</span>
              <div className="acoes">
                <button onClick={() => { setEditandoId(user.id); setFormData({nome: user.nome, email: user.email, senha: ''}); window.scrollTo(0,0); }} className="btn-editar-card">Editar</button>
                <button onClick={async () => { if(confirm("Excluir?")) { await axios.delete(`http://localhost:3000/users/${user.id}`); fetchUsuarios(); } }} className="btn-excluir-card">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
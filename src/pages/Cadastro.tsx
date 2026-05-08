import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { PROFISSOES, calcularClasse } from '@/services/userClass'

export function Cadastro() {
  const { setUser } = useUser()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [profissao, setProfissao] = useState(PROFISSOES[0])
  const [renda, setRenda] = useState('')
  const [cep, setCep] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const rendaNum = Number.parseFloat(renda) || 0
    const userClass = calcularClasse(profissao, rendaNum, cep)
    setUser({
      id: crypto.randomUUID(),
      nome,
      profissao,
      renda: rendaNum,
      cep,
      userClass,
    })
    navigate('/dashboard')
  }

  return (
    <section className="page form-page">
      <h1>Adesão de paciente</h1>
      <p className="muted">
        Em poucos minutos você ativa seu cartão digital e recebe acesso ao
        portal clínico da Atlas Saúde.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome completo</span>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Profissão</span>
          <select
            value={profissao}
            onChange={(e) => setProfissao(e.target.value)}
          >
            {PROFISSOES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Renda mensal aproximada (R$)</span>
          <input
            type="number"
            min="0"
            step="100"
            required
            value={renda}
            onChange={(e) => setRenda(e.target.value)}
          />
        </label>

        <label className="field">
          <span>CEP residencial</span>
          <input
            type="text"
            required
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </label>

        <button type="submit">Concluir adesão</button>
      </form>
    </section>
  )
}

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { PROFISSOES, calcularClasse, mapToBackendClass } from '@/services/userClass'
import { createCustomer } from '@/services/customer'
import { ApiRequestError } from '@/services/api'

export function Cadastro() {
  const { setUser } = useUser()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [profissao, setProfissao] = useState(PROFISSOES[0])
  const [renda, setRenda] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepErro, setCepErro] = useState<string | null>(null)

  async function buscarCep(cepDigits: string) {
    setCepLoading(true)
    setCepErro(null)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      const data = await res.json()
      if (data.erro) {
        setCepErro('CEP não encontrado. Preencha o endereço manualmente.')
        return
      }
      if (data.logradouro) setRua(data.logradouro)
      if (data.localidade) setCidade(data.localidade)
    } catch {
      // Sem conexão com o ViaCEP: o usuário ainda pode preencher manualmente.
      setCepErro('Não foi possível buscar o CEP. Preencha o endereço manualmente.')
    } finally {
      setCepLoading(false)
    }
  }

  function handleCep(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits)
    setCepErro(null)
    // Assim que o CEP fica completo (8 dígitos), busca rua e cidade.
    if (digits.length === 8) buscarCep(digits)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setSubmitting(true)

    const rendaNum = Number.parseFloat(renda) || 0
    const userClass = calcularClasse(profissao, rendaNum, cep)
    const numeroNum = Number.parseInt(numero, 10) || 0

    try {
      const created = await createCustomer({
        name: nome,
        email,
        customerClass: mapToBackendClass(userClass),
        address: {
          latitude: 0,
          longitude: 0,
          city: cidade,
          street: rua,
          houseNumber: numeroNum,
        },
      })

      setUser({
        id: crypto.randomUUID(),
        customerId: created.id,
        nome,
        email,
        profissao,
        renda: rendaNum,
        cep,
        userClass,
      })
      navigate('/dashboard')
    } catch (err) {
      const msg =
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível concluir a adesão. Tente novamente.'
      setErro(msg)
    } finally {
      setSubmitting(false)
    }
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
          <span>E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            step="any"
            required
            value={renda}
            onChange={(e) => setRenda(e.target.value)}
          />
        </label>

        <label className="field">
          <span>
            CEP residencial
            {cepLoading && <span className="field-hint"> · buscando endereço…</span>}
          </span>
          <input
            type="text"
            required
            placeholder="00000-000"
            maxLength={9}
            minLength={9}
            pattern="\d{5}-\d{3}"
            value={cep}
            onChange={(e) => handleCep(e.target.value)}
          />
          {cepErro && <small className="field-error">{cepErro}</small>}
        </label>

        <label className="field">
          <span>Cidade</span>
          <input
            type="text"
            required
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Rua</span>
          <input
            type="text"
            required
            value={rua}
            onChange={(e) => setRua(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Número</span>
          <input
            type="number"
            min="0"
            required
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </label>

        {erro && (
          <p role="alert" className="form-error">
            {erro}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Concluir adesão'}
        </button>
      </form>
    </section>
  )
}

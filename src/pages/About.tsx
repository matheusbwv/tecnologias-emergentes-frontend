export function About() {
  return (
    <section className="page">
      <h1>Sobre o projeto</h1>

      <h2>Problemática</h2>
      <p>
        Investigação da estratificação algorítmica e do acesso desigual a
        ferramentas críticas de IA na saúde. O design do software e a UX são
        usados como evidência de que o capital econômico dita a velocidade do
        diagnóstico e a eficiência do cuidado preventivo.
      </p>

      <h2>Como funciona</h2>
      <p>
        O sistema calcula o nível de acesso de cada usuário a partir de três
        pilares: <strong>profissão</strong> (pesos hierárquicos de prestígio),{' '}
        <strong>renda</strong> (faixas salariais declaradas) e{' '}
        <strong>endereço</strong> (CEP como indicador de infraestrutura).
      </p>

      <h2>Funcionalidades por classe</h2>
      <ul>
        <li>
          <strong>Classe B+ (VIP):</strong> diagnóstico instantâneo via IA,
          agendamento automático no hospital mais próximo, prioridade no topo
          da fila e UI em tons dourados.
        </li>
        <li>
          <strong>Classe C− (Base):</strong> acesso apenas aos dados brutos do
          exame, agendamento manual via lista de espera, fila por ordem de
          chegada e UI em tons cinza/azul frio com paywalls educativos.
        </li>
      </ul>

      <h2>Discussão crítica</h2>
      <p>
        O atraso na interpretação de um hemograma — por falta de IA — pode
        agravar doenças em classes mais baixas. O software deixa de ser neutro
        e passa a ser um agente de estratificação social. A democratização da
        tecnologia não é garantida pela existência da IA, mas pela política de
        acesso a ela.
      </p>
    </section>
  )
}

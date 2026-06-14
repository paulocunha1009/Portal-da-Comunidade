/**
 * Serviço de comunicação com o Assistente Educacional
 * O endpoint é configurado via window.PORTAL_AI_ENDPOINT.
 * Se não configurado, aponta para localhost:3001 (desenvolvimento local).
 */

const endpoint = window.PORTAL_AI_ENDPOINT || 'http://localhost:3001/api/assistente';

/**
 * Envia uma mensagem ao assistente e retorna a resposta estruturada.
 * @param {string} mensagem - Mensagem do usuário
 * @param {Array}  historico - Histórico da conversa [{ role, content }]
 * @returns {Promise<{type: string, content?: string, questions?: Array, pages?: Array}>}
 */
export async function perguntarAssistente(mensagem, historico = []) {
  // Fallback local quando o backend não está configurado
  if (!endpoint || endpoint.includes('seu-backend')) {
    return respostaLocal(mensagem);
  }

  const resposta = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: mensagem, history: historico }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.error || `Erro ${resposta.status} do servidor.`);
  }

  const dados = await resposta.json();

  // Normaliza: se vier string bruta, encapsula
  if (typeof dados.answer === 'string') {
    return { type: 'message', content: dados.answer };
  }

  return dados.answer || { type: 'message', content: 'Resposta não reconhecida.' };
}

// ── Fallback local (sem backend) ─────────────────────────────────────────────
function respostaLocal(pergunta) {
  const t = pergunta.toLowerCase();

  if (t.includes('quiz') || t.includes('me test') || t.includes('pergunta sobre')) {
    return {
      type: 'message',
      content: 'Para gerar quizzes interativos, inicie o backend: abra o terminal na pasta /backend, rode "npm install" e depois "npm start". Com o servidor rodando, os quizzes funcionam automaticamente! 🧠',
    };
  }

  if (t.includes('planta medicinal') || t.includes('chanana') || t.includes('pata de vaca') || t.includes('janaguba') || t.includes('alecrim')) {
    return {
      type: 'recommendations',
      content: 'Veja as 12 plantas medicinais documentadas pelos estudantes da turma Manoel Louvado:',
      pages: [{ title: 'Plantas Medicinais', url: 'pages/Plantas Medicinais.html', reason: '12 espécies da Caatinga com receitas tradicionais, usos e alertas de saúde' }],
    };
  }

  if (t.includes('nativa') || t.includes('carnaúba') || t.includes('mangue') || t.includes('caatinga') || t.includes('restinga')) {
    return {
      type: 'recommendations',
      content: 'Conheça o inventário de espécies nativas do assentamento:',
      pages: [{ title: 'Plantação Nativa', url: 'pages/Plantação Nativa.html', reason: '17 espécies dos biomas Caatinga, Restinga e Manguezal' }],
    };
  }

  if (t.includes('história') || t.includes('assentamento') || t.includes('ducoco') || t.includes('mártir') || t.includes('reforma agrária')) {
    return {
      type: 'recommendations',
      content: 'Saiba mais sobre a história do Assentamento Lagoa do Mineiro:',
      pages: [
        { title: 'História do Assentamento', url: 'pages/historia.html', reason: 'Origem, mártires, linha do tempo e personagens históricos reais' },
        { title: 'Educação do Campo', url: 'pages/reportagem-educacao.html', reason: 'A escola que nasceu junto com a comunidade' },
      ],
    };
  }

  if (t.includes('agricultur') || t.includes('plantio') || t.includes('colheita') || t.includes('copaglam') || t.includes('açude')) {
    return {
      type: 'recommendations',
      content: 'Explore a produção agrícola e os impactos climáticos:',
      pages: [
        { title: 'Produção Agrícola', url: 'pages/agricola.html', reason: 'Cultivos, COPAGLAM, Açude Corrente e práticas sustentáveis' },
        { title: 'Mudanças Climáticas', url: 'pages/reportagem-clima.html', reason: 'Impactos econômicos das emergências climáticas — pesquisa com 15 famílias' },
      ],
    };
  }

  if (t.includes('educação') || t.includes('escola') || t.includes('alternância') || t.includes('mística') || t.includes('tempo comunidade')) {
    return {
      type: 'recommendations',
      content: 'Conheça a proposta pedagógica da EEMPC Francisco Araújo Barros:',
      pages: [{ title: 'Educação do Campo', url: 'pages/reportagem-educacao.html', reason: 'Pedagogia da Alternância, Místicas, Tempo Comunidade e formação profissional' }],
    };
  }

  return {
    type: 'message',
    content: 'Olá! Para usar a IA real, inicie o backend (pasta /backend → npm install → npm start). Posso orientar sobre: História, Plantas Medicinais, Plantas Nativas, Produção Agrícola e Educação do Campo. O que você gostaria de explorar? 🌱',
  };
}

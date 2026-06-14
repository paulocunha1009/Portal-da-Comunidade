/*
  Exemplo de backend seguro para IA.

  Este arquivo não roda no GitHub Pages. Ele serve como modelo para uma
  função serverless em plataformas como Vercel, Netlify, Render ou Cloudflare.
  A chave da OpenAI deve ficar em variável de ambiente no servidor.
*/

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const { message } = request.body || {};
  if (!message) {
    response.status(400).json({ error: 'Mensagem obrigatória.' });
    return;
  }

  const aiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5',
      instructions: 'Você é um assistente educacional do Portal da Comunidade do Ceará Científico. Responda em português do Brasil, com linguagem clara para estudantes.',
      input: message
    })
  });

  if (!aiResponse.ok) {
    response.status(502).json({ error: 'Falha ao consultar a IA.' });
    return;
  }

  const data = await aiResponse.json();
  response.status(200).json({ answer: extrairTexto(data) });
}

function extrairTexto(data) {
  if (data.output_text) return data.output_text;

  const textos = data.output
    ?.flatMap((item) => item.content || [])
    ?.filter((content) => content.type === 'output_text')
    ?.map((content) => content.text)
    ?.join('\n');

  return textos || 'Não encontrei uma resposta agora.';
}

/**
 * Portal da Comunidade — Backend do Assistente Educacional
 * EEMPC Francisco Araújo Barros · Ceará Científico 2026
 *
 * Proxy seguro entre o frontend e a API Google Gemini.
 * A chave de API NUNCA é exposta ao navegador.
 *
 * Uso local:
 *   npm install
 *   cp .env.example .env  → preencha GEMINI_API_KEY
 *   npm start
 *
 * Deploy (Render.com):
 *   → Configure a variável de ambiente GEMINI_API_KEY no painel do Render
 */

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// ── Configuração ─────────────────────────────────────────────────────────────
const PORT         = parseInt(process.env.PORT        || '3001', 10);
const GEMINI_MODEL = process.env.GEMINI_MODEL         || 'gemini-2.0-flash';
const MAX_TOKENS   = parseInt(process.env.MAX_TOKENS  || '1500', 10);
const RATE_LIMIT   = parseInt(process.env.RATE_LIMIT_PER_MIN || '20', 10);

// Origens permitidas: localhost (dev) + domínio público do site
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost,http://127.0.0.1,null'
).split(',').map(s => s.trim());

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('COLOQUE')) {
  console.error('\n❌ GEMINI_API_KEY não configurada. Copie .env.example para .env e preencha a chave.\n');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é o Assistente Educacional do Portal da Comunidade — projeto da EEMPC Francisco Araújo Barros, Ceará Científico 2026, que documenta a história, biodiversidade e saberes do Assentamento Lagoa do Mineiro, em Itarema, CE.

══════════════════════════════════════
FORMATO DE RESPOSTA — OBRIGATÓRIO
══════════════════════════════════════
Responda SEMPRE em JSON puro e válido. NENHUM texto fora do JSON. Sem markdown. Sem blocos de código.

▸ Mensagem normal — o campo "content" deve ser TEXTO SIMPLES, nunca outro JSON:
{"type":"message","content":"Texto da resposta aqui, direto e sem aspas extras."}

ERRADO (não faça isso):
{"type":"message","content":"{\"type\":\"message\",\"content\":\"...\"}"}

▸ Quiz (quando usuário pedir quiz, quiser ser testado):
{"type":"quiz","topic":"Nome do Tema","questions":[{"q":"Pergunta?","opts":["A) opção","B) opção","C) opção","D) opção"],"correct":0,"explanation":"Explicação do gabarito."}]}
— correct = índice 0–3 da resposta correta
— Padrão: 3 questões. Mínimo 2, máximo 5.

▸ Recomendações de páginas (quando usuário pedir orientação de navegação):
{"type":"recommendations","content":"Texto explicativo simples","pages":[{"title":"Nome da Página","url":"pages/nome.html","reason":"por que recomendo"}]}

══════════════════════════════════════
CONTEÚDO DO PORTAL
══════════════════════════════════════

## HISTÓRIA DO ASSENTAMENTO LAGOA DO MINEIRO
Localização: Itarema, litoral oeste do Ceará
Famílias: 214, em 7 comunidades — Saguim, Lagoa do Mineiro, Mineiro Velho, Corrente, Barbosa, Cedro, Córrego das Moças

Origem: Até 1985, ~150 famílias viviam como moradores de condição nas terras de Francisco Teófilo de Andrade. Em 1985, o padre Aristides anunciou a venda das terras à empresa DUCOCO (coco).

Resistência: Trabalhadores organizados pelas CEBs, apoiados pela Diocese de Itapipoca e Dom Paulo. 90 trabalhadores derrubaram a cerca da DUCOCO diante de 16 policiais. 3 mártires mortos: Francisco Araújo Barros (baleado e degolado durante trabalho de broca) e dois outros.

Marcos históricos:
- Até 1985: 150 famílias como moradores de condição
- 1986: Derrubada da cerca; 3 mártires; Decreto nº 92.826; Posse formal 19/09/1986
- 1987: Criação oficial — Portaria 573/MIRAD
- 1991: Fundação da COPAGLAM com 204 membros (14/04/1991)
- 1998: Construção do Açude Corrente — 731.250 m³
- 03/03/2011: Início da EEMPC Francisco Araújo Barros (Decreto CE 30.493)
- 2022-2023: Implantação dos cursos técnicos (Informática e Agropecuária)
- 2025: 179 estudantes matriculados

## PLANTAS MEDICINAIS (12 espécies — Turma Manoel Louvado, 2º Ano A Técnico, Ceará Científico 2025)
1. Chanana (Turnera subulata) — inflamações, infecções urinárias; chá 10g/litro; evitar na gravidez
2. Pata de Vaca (Bauhinia forficata) — diabetes tipo 2, diurético; não substituir medicação
3. Carnaúba (Copernicia prunifera) — febre, diurético, antimicrobiano (símbolo do Ceará)
4. Torém (Cecropia pachystachya) — tosse, bronquite, pressão alta; xarope com mel
5. Bredo (Amaranthus deflexus) — anti-inflamatório, nutritivo (ferro e proteínas)
6. Quebra-Pedra (Phyllanthus niruri) — cálculos renais, proteção hepática
7. Janaguba (Himatanthus drasticus) — inflamações, úlceras; látex tóxico em dose elevada
8. Alecrim-Pimenta (Lippia sidoides) — bactericida, antifúngico, garganta
9. Aroeira da Praia (Eugenia punicifolia) — cicatrização, antibacteriana
10. Batiputá (Ouratea parviflora) — óleo sagrado Tremembé, antimicrobiano
11. Pepaconha (Pombalia calceolaria) — expectorante, antifebril
12. Mussambê (Cleome spinosa) — cefaleia, repelente natural

## PLANTAÇÃO NATIVA (17 espécies)
Biomas: Caatinga, Restinga, Manguezal — Itarema, CE
Áreas: Morro dos Patos, Patos, Mineiro Velho e entorno
Destaque: Carnaúba (Copernicia prunifera), Mangue-Vermelho (Rhizophora mangle)

## PRODUÇÃO AGRÍCOLA
Agricultura: 50% da renda familiar
Cultivos: milho, feijão, mandioca, hortaliças, coco, caju, jerimum, galinhas caipiras
COPAGLAM: fundada 14/04/1991 com 204 membros
Açude Corrente: 731.250 m³ (1998)
Práticas: cobertura morta, sementes crioulas, consórcio milho+feijão, adubação orgânica, fases da lua

## MUDANÇAS CLIMÁTICAS
15 famílias do Assentamento Salgado Comprido, Itarema
Pesquisadoras: Maria Ariane Verissimo e Alana dos Santos Felix
Orientadora: Priscila Santos de Sousa (abril a outubro de 2025)
Impactos: queimadas, temperaturas extremas, chuvas irregulares, pragas, acúmulo de lixo
13 de 15 famílias sem orçamento formal. Renda: 50% agricultura, 20% bolsa família

## EDUCAÇÃO DO CAMPO
EEMPC Francisco Araújo Barros: Decreto CE 30.493 (03/03/2011), Educação Profissional Integral
Cursos: Informática e Agropecuária. 179 estudantes (2025), 7 comunidades, internato no TE

Pedagogia da Alternância:
- Origem: 1935, França — Maison Familiale Rurale de Lauzun
- Brasil: 1969, EFA de Anchieta/ES
- Tempo Escola (TE): aulas, técnicos, místicas, assembleias
- Tempo Comunidade (TC): pesquisa na família, Caderno da Realidade, Plano de Estudo

Místicas: ritual coletivo artístico-político de identidade (origem MST). NÃO é cerimônia religiosa.
Tipos: Abertura, Encerramento, Luta (datas históricas), Temática (ligada ao conteúdo)

## PÁGINAS DO PORTAL
- "../index.html" — Página inicial
- "historia.html" — História: mártires, Reforma Agrária, linha do tempo
- "reportagem-educacao.html" — Educação do Campo, Alternância, Místicas
- "agricola.html" — Produção agrícola, COPAGLAM
- "reportagem-clima.html" — Mudanças climáticas e agricultura familiar
- "Plantação Nativa.html" — 17 espécies nativas
- "Plantas Medicinais.html" — 12 plantas medicinais
- "memoria.html" — Memória e depoimentos
- "../contato.html" — Contato

══════════════════════════════════════
DIRETRIZES
══════════════════════════════════════
- Responda SEMPRE em português brasileiro
- Linguagem acessível para estudantes do Ensino Médio
- Para temas de saúde: sempre recomendar consultar profissional
- Quizzes: use dados reais do portal acima
- Para dúvidas fora do portal (matemática, informática, ciências, etc.): responda com conhecimento geral e, quando possível, relacione ao contexto da comunidade
- Seja encorajador — celebre o interesse dos estudantes pela própria comunidade`;

// ── Rate limiting simples ─────────────────────────────────────────────────────
const requestMap = new Map();

function rateLimit(req, res, next) {
  const ip  = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const win = 60_000;
  const ts  = (requestMap.get(ip) || []).filter(t => now - t < win);

  if (ts.length >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Muitas requisições. Aguarde um momento.' });
  }
  ts.push(now);
  requestMap.set(ip, ts);

  if (requestMap.size > 1000) {
    for (const [k, v] of requestMap) {
      if (v.every(t => now - t > win)) requestMap.delete(k);
    }
  }
  next();
}

// ── Express ───────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin(origin, cb) {
    if (!origin || origin === 'null' || ALLOWED_ORIGINS.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`Origem bloqueada: ${origin}`));
    }
  },
  methods: ['POST', 'GET'],
}));

app.use(express.json({ limit: '20kb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ ok: true, model: GEMINI_MODEL, timestamp: new Date().toISOString() });
});

// ── Notícias ao vivo (proxy RSS → JSON, sem CORS) ─────────────────────────────
const FEEDS = [
  { url: 'https://g1.globo.com/dynamo/educacao/rss2.xml',                         categoria: 'Educação',  icone: '🎓', classe: 'badge--educacao'   },
  { url: 'https://agenciabrasil.ebc.com.br/rss/educacao/feed.xml',                categoria: 'Vestibular',icone: '📝', classe: 'badge--vestibular' },
  { url: 'https://canaltech.com.br/rss/',                                          categoria: 'Tecnologia',icone: '💻', classe: 'badge--tecnologia' },
  { url: 'https://agenciabrasil.ebc.com.br/rss/ciencia-e-tecnologia/feed.xml',    categoria: 'Inovação',  icone: '🌱', classe: 'badge--inovacao'   },
];

let noticiasCache = null;
let noticiasTs    = 0;
const NOTICIAS_TTL = 30 * 60 * 1000; // 30 minutos

function extrairItensRSS(xml) {
  const itens = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const bloco = m[1];
    const tag = (t) => { const r = bloco.match(new RegExp(`<${t}[^>]*>(?:<\\!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${t}>`, 'i')); return r ? r[1].trim() : ''; };
    const link = tag('link') || bloco.match(/<link[^>]*href="([^"]+)"/i)?.[1] || '';
    const pub  = tag('pubDate') || tag('dc:date') || '';
    const desc = tag('description') || tag('content:encoded') || '';
    const titulo = tag('title');
    if (titulo) itens.push({ titulo, resumo: desc, link, pub });
  }
  return itens;
}

function limparHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
             .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"')
             .replace(/&#[0-9]+;/g,'').replace(/\s+/g,' ').trim();
}

async function fetchFeed(feed) {
  const resp = await fetch(feed.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 PortalComunidade/1.0' },
    signal: AbortSignal.timeout(8000),
  });
  const xml   = await resp.text();
  const itens = extrairItensRSS(xml).slice(0, 2);
  return itens.map(item => {
    const resumo = limparHtml(item.resumo);
    const data   = item.pub ? new Date(item.pub).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    return {
      titulo:    limparHtml(item.titulo),
      resumo:    resumo.length > 130 ? resumo.slice(0, 130).replace(/\s\S*$/, '') + '…' : resumo,
      data,
      link:      item.link,
      categoria: feed.categoria,
      icone:     feed.icone,
      classe:    feed.classe,
    };
  });
}

app.get('/api/noticias', async (_req, res) => {
  // Serve do cache se ainda válido
  if (noticiasCache && Date.now() - noticiasTs < NOTICIAS_TTL) {
    return res.json({ noticias: noticiasCache, cached: true });
  }
  try {
    const resultados = await Promise.allSettled(FEEDS.map(fetchFeed));
    const todas = resultados.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    const top4  = todas.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 4);

    if (top4.length > 0) {
      noticiasCache = top4;
      noticiasTs    = Date.now();
    }
    res.json({ noticias: top4.length > 0 ? top4 : (noticiasCache || []) });
  } catch (e) {
    console.error('Erro noticias:', e.message);
    res.json({ noticias: noticiasCache || [] });
  }
});

// ── Endpoint principal ────────────────────────────────────────────────────────
app.post('/api/assistente', rateLimit, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Campo "message" obrigatório.' });
  }
  if (message.trim().length === 0 || message.length > 2000) {
    return res.status(400).json({ error: 'Mensagem deve ter entre 1 e 2000 caracteres.' });
  }
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'Campo "history" deve ser um array.' });
  }

  try {
    // Converte histórico: Gemini usa "model" em vez de "assistant"
    const geminiHistory = history
      .slice(-20)
      .filter(h => h.role && h.content && typeof h.content === 'string')
      .map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      }));

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: MAX_TOKENS,
        temperature: 0.7,
        responseMimeType: 'application/json', // Força JSON válido e bem formatado
      },
    });

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message.trim());
    const rawText = result.response.text() || '';

    // Extrai e normaliza JSON da resposta
    let parsed;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

      // Corrige double-wrapping: modelo às vezes retorna JSON dentro do campo content
      // Ex: {"type":"message","content":"{\"type\":\"message\",\"content\":\"...\"}"}
      if (parsed && typeof parsed.content === 'string') {
        const trimmed = parsed.content.trim();
        if (trimmed.startsWith('{"type"')) {
          // Tenta parse direto primeiro
          try {
            const inner = JSON.parse(trimmed);
            if (inner && inner.type) {
              parsed = inner;
            }
          } catch {
            // JSON interno inválido (aspas não escapadas no content)
            // Extrai o texto usando indexOf/lastIndexOf — funciona mesmo com aspas soltas
            const marker = '"content":"';
            const start = trimmed.indexOf(marker);
            if (start !== -1) {
              const textStart = start + marker.length;
              const textEnd = trimmed.lastIndexOf('"}');
              if (textEnd > textStart) {
                const extracted = trimmed.slice(textStart, textEnd)
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"');
                parsed = { type: 'message', content: extracted };
              }
            }
          }
        }
      }
    } catch {
      // Fallback: retorna como mensagem de texto simples
      parsed = { type: 'message', content: rawText.replace(/```json\n?|```/g, '').trim() };
    }

    res.json({ answer: parsed });

  } catch (erro) {
    console.error('Erro Gemini:', erro.message);

    if (erro.message?.includes('API_KEY') || erro.status === 400) {
      return res.status(500).json({ error: 'Chave da API inválida. Verifique o arquivo .env.' });
    }
    if (erro.status === 429 || erro.message?.includes('quota')) {
      return res.status(429).json({ error: 'Limite da API atingido. Tente novamente em instantes.' });
    }

    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

// ── Inicia servidor ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 Portal da Comunidade — Assistente Educacional (Gemini)`);
  console.log(`   Backend rodando em: http://localhost:${PORT}`);
  console.log(`   Modelo: ${GEMINI_MODEL}  |  Rate limit: ${RATE_LIMIT} req/min`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

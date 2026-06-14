# Backend do Assistente Educacional
**Portal da Comunidade · EEMPC Francisco Araújo Barros · Ceará Científico 2026**

Servidor Node.js que atua como proxy seguro entre o frontend e a **API Google Gemini**.
**A chave da API nunca é exposta no navegador.**

---

## Instalação local (teste no seu computador)

```bash
# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de configuração
cp .env.example .env

# 4. Abra o .env e coloque sua chave Gemini
notepad .env

# 5. Inicie o servidor
npm start
```

O servidor sobe em **http://localhost:3001**

Teste abrindo: `http://localhost:3001/health`
Deve retornar: `{"ok":true,"model":"gemini-2.0-flash","timestamp":"..."}`

---

## Obter a chave Gemini (gratuita)

1. Acesse **https://aistudio.google.com/app/apikey**
2. Faça login com sua conta Google
3. Clique em **Create API Key**
4. Copie a chave e cole no `.env` como `GEMINI_API_KEY=AIza...`

> A API Gemini tem tier gratuito generoso (60 req/min, sem cartão de crédito)

---

## Deploy público — Render.com (gratuito)

Para o site funcionar online, o backend precisa estar hospedado. Recomendamos o **Render.com**:

### Passo 1 — Suba o código para o GitHub
```bash
# Na raiz do projeto (portal-comunidade/)
git init
git add .
git commit -m "Portal da Comunidade - Ceará Científico 2026"
git remote add origin https://github.com/SEU-USUARIO/portal-comunidade.git
git push -u origin main
```
> ⚠️ Certifique-se de que o `.gitignore` inclui `backend/.env`

### Passo 2 — Deploy no Render.com
1. Acesse **https://render.com** e crie uma conta (gratuito)
2. Clique em **New → Web Service**
3. Conecte seu repositório GitHub
4. Configure assim:
   - **Name**: `portal-comunidade-ai`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Em **Environment Variables**, adicione:
   - `GEMINI_API_KEY` = sua chave
   - `ALLOWED_ORIGINS` = `https://SEU-USUARIO.github.io,https://seu-site.netlify.app`
6. Clique em **Deploy**

Você receberá uma URL como: `https://portal-comunidade-ai.onrender.com`

### Passo 3 — Configure o frontend
Abra `js/config.js` e descomente/atualize:
```js
window.PORTAL_AI_ENDPOINT = 'https://portal-comunidade-ai.onrender.com/api/assistente';
```

### Passo 4 — Hospede o frontend
**GitHub Pages** (recomendado):
1. Vá em Settings → Pages no seu repositório
2. Source: `main` branch, pasta `/` (raiz)
3. Seu site ficará em: `https://SEU-USUARIO.github.io/portal-comunidade`

**Netlify** (alternativa):
1. Acesse **https://netlify.com**
2. Arraste a pasta do projeto para o painel → deploy automático

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `GEMINI_API_KEY` | — | **Obrigatório.** Chave da API Google Gemini |
| `PORT` | `3001` | Porta do servidor |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Modelo Gemini |
| `MAX_TOKENS` | `1500` | Máximo de tokens por resposta |
| `RATE_LIMIT_PER_MIN` | `20` | Requisições por IP por minuto |
| `ALLOWED_ORIGINS` | `localhost,null` | Origens CORS permitidas |

---

## Segurança

- ✅ Chave da API fica **apenas no servidor**
- ✅ CORS limita as origens que podem chamar o endpoint
- ✅ Rate limiting evita abuso
- ✅ Validação de entrada (tamanho, tipo)
- ✅ `.env` está no `.gitignore` — **nunca suba para o GitHub**

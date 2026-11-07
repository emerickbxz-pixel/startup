# E-Study

PWA de rede social para estudos. Demonstração para feira de empreendedorismo.
Público: estudantes de ensino médio.

## Como rodar localmente

Como é HTML/CSS/JS puro, é só abrir `index.html` no navegador — mas o
Tutor de IA não vai funcionar assim (ele depende da função serverless, que
só roda na Vercel ou com `vercel dev`). Sem a função, o tutor cai
automaticamente nas respostas de exemplo, então a demonstração continua
funcionando mesmo offline.

## Deploy na Vercel

1. Importe este repositório na Vercel (vercel.com → New Project).
2. Em **Settings → Environment Variables**, adicione:
   - `ANTHROPIC_API_KEY` = sua chave da API da Anthropic (console.anthropic.com)
3. Faça o deploy. A função `api/tutor.js` fica disponível em `/api/tutor`
   automaticamente — não precisa configurar nada além da chave.

Sem a chave configurada, o site inteiro continua funcionando normalmente,
só o Tutor de IA mostra os exemplos fixos em vez de respostas geradas na
hora.

## Estrutura

- `index.html` — página única com todo o HTML/CSS/JS do protótipo
  (feed de dúvidas, tutor de IA, comunidade, reputação).
- `api/tutor.js` — função serverless que chama a IA da Anthropic.
  A chave de API fica só aqui, nunca no navegador.

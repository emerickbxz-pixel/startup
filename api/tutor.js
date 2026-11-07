// Função serverless (Vercel) do Tutor de IA.
// Recebe a pergunta do aluno, manda pra API da Anthropic e devolve a
// explicação. A chave da API (ANTHROPIC_API_KEY) fica só aqui no servidor,
// como variável de ambiente — nunca aparece no código do navegador.

const MODEL = 'claude-sonnet-5';

const SYSTEM_PROMPT = `Você é o tutor de IA da plataforma E-Study, uma rede social de estudos para alunos do ensino médio brasileiro.
Explique sempre passo a passo, numerando os passos (1., 2., 3. ...), nunca entregue só a resposta final sem mostrar o raciocínio.
Use frases curtas e linguagem simples, como se estivesse ajudando um colega de turma.
Se a pergunta não tiver relação com matérias escolares, responda educadamente que você só ajuda com dúvidas de estudos.
Responda sempre em português do Brasil.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const question = ((req.body && req.body.question) || '').toString().trim().slice(0, 500);
  if (!question) {
    res.status(400).json({ ok: false, error: 'empty_question' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Sem chave configurada na Vercel: o front-end cai no modo de exemplo.
    res.status(200).json({ ok: false, error: 'no_key' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!response.ok) {
      res.status(200).json({ ok: false, error: 'api_error' });
      return;
    }

    const data = await response.json();
    const answer = data.content && data.content[0] && data.content[0].text;

    if (!answer) {
      res.status(200).json({ ok: false, error: 'empty_answer' });
      return;
    }

    res.status(200).json({ ok: true, answer });
  } catch (err) {
    res.status(200).json({ ok: false, error: 'network_error' });
  }
};

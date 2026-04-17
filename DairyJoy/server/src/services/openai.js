const OpenAI = require('openai');

let client;
function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('缺少 OPENAI_API_KEY 环境变量');
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

async function chatCompletion(messages, { json = false, temperature = 0.8 } = {}) {
  const openai = getClient();
  const resp = await openai.chat.completions.create({
    model: MODEL,
    temperature,
    messages,
    ...(json ? { response_format: { type: 'json_object' } } : {}),
  });
  return resp.choices?.[0]?.message?.content || '';
}

async function chatJSON(messages, opts = {}) {
  const raw = await chatCompletion(messages, { ...opts, json: true });
  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('OpenAI 返回内容无法解析为 JSON: ' + raw.slice(0, 200));
  }
}

module.exports = { chatCompletion, chatJSON, MODEL };

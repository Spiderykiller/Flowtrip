/**
 * POST /api/ai/chat
 *
 * Supports two free AI providers — pass { provider: "gemini" | "groq" } in the body.
 *
 * Free keys (no credit card):
 *   Gemini → https://aistudio.google.com  → GEMINI_API_KEY
 *   Groq   → https://console.groq.com     → GROQ_API_KEY
 */

import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are FlowTrip AI, the world's most intelligent travel planning assistant. Your personality is warm, knowledgeable, and conversational — like a brilliant friend who has traveled everywhere.

Your capabilities:
- Build complete, day-by-day itineraries with specific neighborhoods, restaurants, activities, and tips
- Stay strictly within stated budgets and provide cost breakdowns
- Avoid tourist traps and suggest authentic local experiences
- Factor in travel seasons, weather, festivals, and local events
- Answer follow-up questions and adjust plans mid-conversation
- Provide practical logistics: transport, accommodation types, best booking windows

Rules:
- Always ask clarifying questions if budget, duration, or destination is unclear
- Format itineraries clearly with Day 1, Day 2, etc.
- Use **bold** for key places/restaurants/tips
- Keep responses conversational, not robotic — show enthusiasm for travel
- Always end with "Want me to adjust anything?" or a follow-up question
- Never make up specific prices as definitive facts; use estimates and ranges`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type Provider = 'gemini' | 'groq';

// ── Gemini ────────────────────────────────────────────────────────────────────

async function callGemini(messages: Message[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const geminiMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I'm having trouble responding right now. Please try again!"
  );
}

// ── Groq ──────────────────────────────────────────────────────────────────────

async function callGroq(messages: Message[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // best free model on Groq
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return (
    data?.choices?.[0]?.message?.content ??
    "I'm having trouble responding right now. Please try again!"
  );
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let messages: Message[];
  let provider: Provider;

  try {
    const body = await request.json();
    messages = body.messages;
    provider = body.provider ?? 'gemini'; // default to Gemini
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
  }

  if (provider !== 'gemini' && provider !== 'groq') {
    return NextResponse.json({ error: 'Invalid provider.' }, { status: 400 });
  }

  try {
    const text =
      provider === 'groq'
        ? await callGroq(messages)
        : await callGemini(messages);

    return NextResponse.json({ text, provider });
  } catch (err) {
    console.error(`[/api/ai/chat] ${provider} failed:`, err);
    return NextResponse.json(
      { error: `${provider === 'gemini' ? 'Gemini' : 'Groq'} is unavailable. Try switching providers.` },
      { status: 502 }
    );
  }
}
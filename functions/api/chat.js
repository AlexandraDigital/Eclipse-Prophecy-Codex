/**
 * Cloudflare Pages Function: /api/chat
 * Set GROQ_API_KEY in your Cloudflare Pages → Settings → Environment Variables
 * Model: llama-3.3-70b-versatile (fast, high quality)
 */
export async function onRequestPost({ request, env }) {
  try {
    const { system, messages } = await request.json();

    if (!env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY environment variable is not set." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const groqMessages = [
      { role: "system", content: system },
      ...messages,
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 1200,
        temperature: 0.85,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return new Response(
        JSON.stringify({ error: `Groq API error: ${groqRes.status}`, detail: err }),
        { status: groqRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({ content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

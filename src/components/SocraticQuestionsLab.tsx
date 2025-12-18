import React, { useEffect, useState } from "react";
import { buildLaboratorioPrompt } from "../lib/laboratorioIA";
import { llmClient } from "../lib/llmClient";

export function SocraticQuestionsLab() {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: { role: 'user' | 'assistant'; content: string } = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // El prompt rector y la lógica de backend siguen activos
      const resp = await llmClient.analizar(input);
      setMessages((prev) => [...prev, { role: 'assistant', content: resp }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error al consultar Gemini' }]);
    }
    setLoading(false);
  };

  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl font-semibold mb-4">Laboratorio Socrático (Conversacional IA)</h2>
      <div className="border rounded bg-card p-4 min-h-[300px] mb-4">
        {messages.length === 0 && (
          <div className="text-muted-foreground">Inicia la conversación con una pregunta, dilema o reflexión.</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right mb-2' : 'text-left mb-2'}>
            <span
              className={
                msg.role === 'user'
                  ? 'inline-block bg-red-600 text-white font-bold rounded px-3 py-1 shadow'
                  : 'inline-block bg-muted text-purple-700 font-bold rounded px-3 py-1 border border-purple-400 shadow'
              }
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={handleSend}>
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
}

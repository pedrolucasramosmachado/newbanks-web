import { useState } from "react";

type Message = {
  id: number;
  author: "user" | "katarina";
  text: string;
};

export function Katarina() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "katarina",
      text: "Olá! Eu sou a Katarina. Posso analisar seu saldo, gastos e decisões financeiras.",
    },
  ]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      author: "user",
      text: trimmedQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("newbanks_token");
console.log(import.meta.env.VITE_API_URL);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/katarina/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: trimmedQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível consultar a Katarina.");
      }

      const katarinaMessage: Message = {
        id: Date.now() + 1,
        author: "katarina",
        text: data.answer,
      };

      setMessages((current) => [...current, katarinaMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        author: "katarina",
        text:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado.",
      };

      setMessages((current) => [...current, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(suggestion: string) {
  setQuestion(suggestion);
}

  return (
    <main style={{ minHeight: "100vh", padding: "32px", background: "#f5f7fb" }}>
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <header style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>Katarina</h1>
          <p style={{ color: "#667085" }}>
            Sua assistente financeira inteligente
          </p>
        </header>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          {[
            "Qual meu saldo?",
            "Quanto economizei?",
            "Onde estou gastando mais?",
            "Posso gastar R$ 500?",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestion(suggestion)}
              style={{
                border: "1px solid #d0d5dd",
                background: "#ffffff",
                borderRadius: "999px",
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div
          style={{
            minHeight: "420px",
            maxHeight: "520px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "16px",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf:
                  message.author === "user" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "16px",
                whiteSpace: "pre-wrap",
                background:
                  message.author === "user" ? "#101828" : "#ffffff",
                color: message.author === "user" ? "#ffffff" : "#101828",
                boxShadow:
                  message.author === "katarina"
                    ? "0 4px 12px rgba(0, 0, 0, 0.06)"
                    : "none",
              }}
            >
              {message.text}
            </div>
          ))}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "12px 16px",
                borderRadius: "16px",
                background: "#ffffff",
              }}
            >
              Katarina está analisando...
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Pergunte algo sobre suas finanças"
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #d0d5dd",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            style={{
              padding: "14px 22px",
              border: 0,
              borderRadius: "12px",
              background: "#101828",
              color: "#ffffff",
              cursor: "pointer",
              opacity: loading || !question.trim() ? 0.6 : 1,
            }}
          >
            Enviar
          </button>
        </form>
      </section>
    </main>
  );
}
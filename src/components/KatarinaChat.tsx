import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  author: "user" | "katarina";
  text: string;
};

type KatarinaChatProps = {
  open: boolean;
  onClose: () => void;
};

const suggestions = [
  "💰 Qual meu saldo?",
  "📈 Quanto economizei?",
  "📊 Onde gasto mais?",
  "💡 Onde posso economizar?",
];

export function KatarinaChat({
  open,
  onClose,
}: KatarinaChatProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
const [minimized, setMinimized] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "katarina",
      text: "Olá! Eu sou a Katarina. Como posso ajudar com suas finanças?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

useEffect(() => {
  if (!open) {
    setMinimized(true);
  }
}, [open]);

  async function sendQuestion(selectedQuestion?: string) {
    const trimmedQuestion = (
      selectedQuestion ?? question
    ).trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      author: "user",
      text: trimmedQuestion,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem(
        "newbanks_token"
      );

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
        throw new Error(
          data.message ||
            "Não foi possível consultar a Katarina."
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "katarina",
          text: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "katarina",
          text:
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendQuestion();
  }

  if (!open) {
    return null;
  }

if (minimized) {
  return (
    <button
      type="button"
      onClick={() => setMinimized(false)}
      style={styles.minimizedButton}
      aria-label="Abrir Katarina"
    >
     <div style={styles.minimizedAvatar}>
  <img
    src="/katarina-avatar.png"
    alt="Katarina"
    style={styles.avatarImage}
  />
</div>

      <div style={styles.minimizedContent}>
  <strong style={styles.minimizedTitle}>
    Katarina
  </strong>

  <span style={styles.minimizedText}>
    🟢 Online
  </span>

  <span
    style={{
      fontSize: "10px",
      color: "#7f7f91",
      marginTop: "2px",
    }}
  >
    Sempre pronta para ajudar
  </span>
</div>
      <span style={styles.minimizedStatus} />
    </button>
  );
}
  return (
    <section style={styles.chat}>
      <header style={styles.header}>
        <div style={styles.headerIdentity}>
          <div style={styles.avatar}>
   <img
    src="/katarina-avatar.png"
    alt="Katarina"
    style={styles.avatarImage}
  />
</div>

          <div>
            <strong style={styles.title}>
              Katarina
            </strong>

            <span style={styles.status}>
              <span style={styles.statusDot} />
              Assistente financeira
            </span>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label="Minimizar chat"
            title="Minimizar"
            style={styles.headerButton}
          >
            −
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar chat"
            title="Fechar"
            style={styles.headerButton}
          >
            ✕
          </button>
        </div>
      </header>

      <div style={styles.suggestionsWrapper}>
  <div style={styles.suggestions}>
  {suggestions.map((suggestion) => (
    <button
      key={suggestion}
      type="button"
      disabled={loading}
      onClick={() => sendQuestion(suggestion)}
      style={styles.suggestionButton}
    >
      {suggestion}
    </button>
  ))}
</div>

 
</div>

      <div
  className="katarina-messages"
  style={styles.messages}
>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              alignSelf:
                message.author === "user"
                  ? "flex-end"
                  : "flex-start",
              background:
                message.author === "user"
                  ? "linear-gradient(135deg, #7248ff, #5330d9)"
                  : "#171722",
              borderBottomRightRadius:
                message.author === "user"
                  ? "4px"
                  : "16px",
              borderBottomLeftRadius:
                message.author === "katarina"
                  ? "4px"
                  : "16px",
            }}
          >
          <div
  className="messageText"
  style={styles.messageText}
>
  <ReactMarkdown>{message.text}</ReactMarkdown>
</div>
          </div>
        ))}

        {loading && (
          <div
  style={{
    ...styles.message,
    ...styles.loadingMessage,
  }}
>
  <span className="typing-dot"></span>
  <span className="typing-dot"></span>
  <span className="typing-dot"></span>
</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <input
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder="Pergunte sobre suas finanças..."
          disabled={loading}
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          style={{
            ...styles.sendButton,
            opacity:
              loading || !question.trim()
                ? 0.5
                : 1,
            cursor:
              loading || !question.trim()
                ? "not-allowed"
                : "pointer",
          }}
        >
         ➜
        </button>
      </form>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  chat: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 1000,
    width: "min(410px, calc(100vw - 32px))",
    height: "min(650px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "22px",
    border: "1px solid rgba(124, 92, 255, 0.32)",
    background: "#0d0d14",
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.55)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    background:
      "linear-gradient(135deg, rgba(114, 72, 255, 0.22), rgba(13, 13, 20, 0.9))",
  },

  headerIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  headerButton: {
    width: "34px",
    height: "34px",
    display: "grid",
    placeItems: "center",
    padding: 0,
    border: 0,
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: 1,
    fontFamily: "Arial, sans-serif",
  },



  title: {
    display: "block",
    color: "#ffffff",
    fontSize: "15px",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "3px",
    color: "#a6a6b3",
    fontSize: "11px",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#43d98b",
  },


suggestions: {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "8px",
  padding: "10px 14px",
  flexShrink: 0,
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
},


suggestionButton: {
  minWidth: 0,
  padding: "9px 10px",
  borderRadius: "12px",
  border: "1px solid rgba(124, 92, 255, 0.32)",
  background: "rgba(124, 92, 255, 0.09)",
  color: "#ddd6ff",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 600,
  lineHeight: 1.3,
  textAlign: "left",
  whiteSpace: "normal",
},
  messages: {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  overflowY: "auto",
  overflowX: "hidden",
  padding: "16px 10px 16px 16px",
},
message: {
  maxWidth: "82%",
  padding: "14px 16px",
  borderRadius: "18px",
  color: "#ffffff",
  fontSize: "14px",
  lineHeight: 1.7,
  whiteSpace: "normal",
  boxShadow: "0 8px 20px rgba(0,0,0,.25)",
},

  loadingMessage: {
    alignSelf: "flex-start",
    background: "#171722",
    color: "#aaaabb",
  },

  form: {
    display: "flex",
    gap: "9px",
    padding: "14px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#101018",
  },

  input: {
    flex: 1,
    minWidth: 0,
    padding: "12px 13px",
    borderRadius: "11px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    outline: "none",
    background: "#08080e",
    color: "#ffffff",
    fontSize: "13px",
  },

  sendButton: {
    padding: "0 17px",
    border: 0,
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #835cff, #623ce5)",
    color: "#ffffff",
    fontWeight: 700,
  },

  minimizedButton: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px 10px 10px",
    border: "1px solid rgba(124, 92, 255, 0.4)",
    borderRadius: "16px",
    background: "#11111a",
    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.45)",
    color: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
  },

  minimizedAvatar: {
    width: "38px",
    height: "38px",
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #835cff, #5430dc)",
    fontWeight: 800,
  },

  minimizedTitle: {
    display: "block",
    fontSize: "13px",
  },

  minimizedText: {
    display: "block",
    marginTop: "2px",
    color: "#9999a8",
    fontSize: "10px",
  },
  minimizedContent: {
  display: "flex",
  flexDirection: "column",
},

minimizedStatus: {
  width: "8px",
  height: "8px",
  marginLeft: "4px",
  borderRadius: "50%",
  background: "#43d98b",
  boxShadow: "0 0 10px rgba(67, 217, 139, 0.7)",
},
messageText: {
  color: "#ffffff",
},
avatar: {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  overflow: "hidden",
  border: "2px solid rgba(255,255,255,.08)",
  boxShadow: "0 6px 18px rgba(114,72,255,.35)",
},

avatarImage: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
},
};

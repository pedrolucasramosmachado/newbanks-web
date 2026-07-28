import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../services/api";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!password.trim()) {
      setError("Informe sua senha.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("newbanks_token", response.data.token);

      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Sem conexão com a internet.");
        } else {
          switch (error.response.status) {
            case 400:
              setError(
                typeof error.response.data?.message === "string"
                  ? error.response.data.message
                  : "Dados inválidos."
              );
              break;

            case 401:
              setError("E-mail ou senha incorretos.");
              break;

            case 404:
              setError("Servidor não encontrado.");
              break;

            case 429:
              setError(
                "Muitas tentativas. Tente novamente em alguns minutos."
              );
              break;

            default:
              if (error.response.status >= 500) {
                setError(
                  "Servidor indisponível. Tente novamente mais tarde."
                );
              } else {
                setError(
                  typeof error.response.data?.message === "string"
                    ? error.response.data.message
                    : "Erro ao fazer login."
                );
              }
          }
        }
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <span className="brand-icon">↗</span>
          <strong>NEWBANKS</strong>
        </div>

        <div className="auth-heading">
          <span className="eyebrow">ACESSO SEGURO</span>
          <h1>Bem-vindo de volta</h1>
          <p>Entre para acessar sua conta digital.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              required
            />
          </label>

          <label>
            Senha

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError("");
                }}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não tem conta? <a href="/register">Criar conta</a>
        </p>
      </section>
    </main>
  );
}
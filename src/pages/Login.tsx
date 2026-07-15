import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("newbanks_token", response.data.token);

      navigate("/dashboard");
    } catch {
      setError("Email ou senha inválidos");
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
              onChange={(event) => setEmail(event.target.value)}
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
      onChange={(event) => setPassword(event.target.value)}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword((current) => !current)}
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
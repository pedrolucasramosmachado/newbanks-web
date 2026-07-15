import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { api } from "../services/api";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("newbanks_token", response.data.token);

      navigate("/dashboard");
    } catch {
      setError("Não foi possível criar sua conta");
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
          <span className="eyebrow">NOVA CONTA</span>
          <h1>Comece agora</h1>
          <p>Crie sua conta digital em poucos segundos.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              placeholder="Pedro Lucas"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

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
      aria-label={
        showPassword
          ? "Ocultar senha"
          : "Mostrar senha"
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
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta? <a href="/login">Entrar</a>
        </p>
      </section>
    </main>
  );
}
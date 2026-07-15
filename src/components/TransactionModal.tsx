import { useState } from "react";

type TransactionModalProps = {
  open: boolean;
  title: string;
  actionLabel: string;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
};

export function TransactionModal({
  open,
  title,
  actionLabel,
  onClose,
  onConfirm,
}: TransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedAmount = Number(
    amount.replace(/\./g, "").replace(",", ".")
  );

  if (!open) {
    return null;
  }

  async function handleConfirm() {
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Informe um valor válido");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onConfirm(parsedAmount);

      setAmount("");
      onClose();
    } catch {
      setError("Não foi possível concluir a operação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="eyebrow">OPERAÇÃO</span>
        <h2>{title}</h2>

        <label>
          Valor

          <div className="money-field">
            <span>R$</span>

            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(event) => {
                const value = event.target.value
                  .replace(/\D/g, "")
                  .replace(/^0+/, "");

                const cents = Number(value || "0") / 100;

                setAmount(
                  cents.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                );
              }}
            />
          </div>
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading || parsedAmount <= 0}
          >
            {loading ? "Processando..." : actionLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
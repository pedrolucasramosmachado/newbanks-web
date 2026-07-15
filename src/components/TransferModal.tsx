import { useState } from "react";

type TransferModalProps = {
  open: boolean;
  balance: string;
  onClose: () => void;
  onConfirm: (
    receiverEmail: string,
    amount: number
  ) => Promise<void>;
};

export function TransferModal({
  open,
  balance,
  onClose,
  onConfirm,
}: TransferModalProps) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const parsedAmount = Number(
  amount.replace(/\./g, "").replace(",", ".")
);

const availableBalance = Number(balance);

const insufficientBalance =
  parsedAmount > availableBalance;

  if (!open) {
    return null;
  }

  async function handleConfirm() {

    if (!receiverEmail.trim()) {
      setError("Informe o e-mail do destinatário");
      return;
    }

    if (!parsedAmount || parsedAmount <= 0) {
      setError("Informe um valor válido");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onConfirm(receiverEmail, parsedAmount);

      setReceiverEmail("");
      setAmount("");
      onClose();
    } catch {
      setError("Não foi possível realizar a transferência");
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
        <span className="eyebrow">TRANSFERÊNCIA</span>
        <h2>Enviar dinheiro</h2>
        <div className="modal-balance">
  <span>Saldo disponível</span>

  <strong>
    {new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(balance))}
  </strong>
</div>

        <label>
          E-mail do destinatário
          <input
            type="email"
            placeholder="destinatario@email.com"
            value={receiverEmail}
            onChange={(event) =>
              setReceiverEmail(event.target.value)
            }
          />
        </label>

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

{insufficientBalance && (
  <p className="form-error">
    Saldo insuficiente.
  </p>
)}

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
  disabled={
    loading ||
    insufficientBalance ||
    !receiverEmail ||
    parsedAmount <= 0
  }
>
            {loading ? "Transferindo..." : "Transferir"}
          </button>
        </div>
      </section>
    </div>
  );
}
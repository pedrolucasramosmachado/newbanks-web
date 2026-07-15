import { ArrowDownLeft, ArrowUpRight, Send } from "lucide-react";

type QuickActionsProps = {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
};

export function QuickActions({
  onDeposit,
  onWithdraw,
  onTransfer,
}: QuickActionsProps) {
  return (
    <section className="quick-actions">
      <button onClick={onDeposit}>
        <ArrowDownLeft size={20} />
        Depositar
      </button>

      <button onClick={onWithdraw}>
        <ArrowUpRight size={20} />
        Sacar
      </button>

      <button onClick={onTransfer}>
        <Send size={20} />
        Transferir
      </button>
    </section>
  );
}
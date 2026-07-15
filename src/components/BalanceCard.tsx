type BalanceCardProps = {
  balance: string;
};

export function BalanceCard({ balance }: BalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(balance));

  return (
    <section className="balance-card">
      <span>Saldo disponível</span>

      <strong>{formattedBalance}</strong>
    </section>
  );
}
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type Transaction = {
  id: string;
  type: string;
  amount: string;
  description: string;
  createdAt: string;
};

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({
  transactions,
}: TransactionListProps) {
  function formatCurrency(value: string) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  }

  if (transactions.length === 0) {
    return (
      <section className="transactions-card">
        <h2>Últimas transações</h2>
        <p className="empty-state">Nenhuma movimentação.</p>
      </section>
    );
  }

  return (
    <section className="transactions-card">
      <div className="section-heading">
        <span className="eyebrow">MOVIMENTAÇÕES</span>
        <h2>Últimas transações</h2>
      </div>

      <div className="transactions-list">
        {transactions.slice(0, 5).map((transaction) => {
          const incoming =
            transaction.type === "DEPOSIT" ||
            transaction.type === "TRANSFER_IN";

          return (
            <article
              className="transaction-item"
              key={transaction.id}
            >
              <div
                className={`transaction-icon ${
                  incoming ? "in" : "out"
                }`}
              >
                {incoming ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}
              </div>

              <div className="transaction-info">
                <strong>
                  {transaction.description || transaction.type}
                </strong>

                <span>
                  {new Date(
                    transaction.createdAt
                  ).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <strong
                className={incoming ? "positive" : "negative"}
              >
                {incoming ? "+" : "-"}{" "}
                {formatCurrency(transaction.amount)}
              </strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}
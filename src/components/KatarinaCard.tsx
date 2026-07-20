type FinancialInsights = {
  income: number;
  expenses: number;
  saved: number;
  savingsRate: number;
  topCategory: string | null;
  biggestExpense: number | null;
  monthlyVariation: number | null;
  recommendations: string[];
};

type KatarinaCardProps = {
  onOpen: () => void;
  insights: FinancialInsights | null;
  loading?: boolean;
};

export function KatarinaCard({
  onOpen,
  insights,
  loading = false,
}: KatarinaCardProps) {
  function getMainMessage() {
    if (loading) {
      return "Analisando suas movimentações...";
    }

    if (!insights || insights.income === 0) {
      return "Registre suas primeiras movimentações para receber análises financeiras.";
    }

    if (insights.expenses === 0) {
      return `Você economizou 100% da sua renda neste mês.`;
    }

    return `Você economizou ${insights.savingsRate.toFixed(
      0
    )}% da sua renda neste mês.`;
  }

  const recommendation =
    insights?.recommendations?.[0] ??
    "Converse comigo para entender melhor suas finanças.";

  return (
    <section className="katarina-card">
      <div>
        <span className="katarina-card-label">KATARINA</span>

        <h2>Sua assistente financeira</h2>

        <p>{getMainMessage()}</p>

        {!loading && insights && (
          <small className="katarina-card-recommendation">
            {recommendation}
          </small>
        )}
      </div>

      <button type="button" onClick={onOpen}>
        Conversar
      </button>
    </section>
  );
}
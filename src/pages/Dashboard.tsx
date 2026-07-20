import {
  useEffect,
  useState,
} from "react";
import axios from "axios";

import { BalanceCard } from "../components/BalanceCard";
import { DashboardHeader } from "../components/DashboardHeader";
import { KatarinaCard } from "../components/KatarinaCard";
import { KatarinaChat } from "../components/KatarinaChat";
import { QuickActions } from "../components/QuickActions";
import { TransactionList } from "../components/TransactionList";
import { TransactionModal } from "../components/TransactionModal";
import { TransferModal } from "../components/TransferModal";
import { useAccount } from "../hooks/useAccount";
import { api } from "../services/api";

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

export function Dashboard() {
  const { account, loading, reload } = useAccount();

  const [insights, setInsights] =
    useState<FinancialInsights | null>(null);

  const [insightsLoading, setInsightsLoading] =
    useState(true);

const [chatOpen, setChatOpen] = useState(true);
const [chatMinimized, setChatMinimized] = useState(true);

  const [modalType, setModalType] = useState<
    "deposit" | "withdraw" | "transfer" | null
  >(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    async function loadInsights() {
      try {
        const response =
          await api.get("/financial-insights");

        setInsights(response.data);
      } catch (error) {
        console.error(
          "Erro ao carregar insights:",
          error
        );
      } finally {
        setInsightsLoading(false);
      }
    }

    loadInsights();
  }, []);

  async function handleDeposit(amount: number) {
    try {
      await api.post("/account/deposit", {
        amount,
      });

      setMessage(
        "✅ Depósito realizado com sucesso"
      );

      setModalType(null);
      await reload();
    } catch (error) {
      let errorMessage =
        "Erro ao realizar depósito.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ??
          errorMessage;
      }

      setMessage(`❌ ${errorMessage}`);
    }
  }

  async function handleWithdraw(amount: number) {
    try {
      await api.post("/account/withdraw", {
        amount,
      });

      setMessage(
        "✅ Saque realizado com sucesso"
      );

      setModalType(null);
      await reload();
    } catch (error) {
      let errorMessage =
        "Erro ao realizar saque.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ??
          errorMessage;
      }

      setMessage(`❌ ${errorMessage}`);
    }
  }

async function handleTransfer(
  receiverEmail: string,
  amount: number,
  description: string
) {
  try {
    await api.post("/account/transfer", {
      receiverEmail,
      amount,
      description,
    });

    setMessage(
      "✅ Transferência realizada com sucesso"
    );

    setModalType(null);
    await reload();
  } catch (error) {
    let errorMessage =
      "Erro ao realizar transferência.";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ??
        errorMessage;
    }

    setMessage(`❌ ${errorMessage}`);
  }
}

  if (loading) {
    return (
      <main className="dashboard-state">
        <div className="loading-spinner" />
        <span>Carregando sua conta...</span>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <DashboardHeader
        name={account?.user.name ?? "Usuário"}
        email={account?.user.email ?? ""}
      />

      <section className="dashboard-container">
        <div className="welcome-row">
          <span className="eyebrow">
            PAINEL FINANCEIRO
          </span>

          <h1>
            Olá, {account?.user.name}
          </h1>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <BalanceCard
          balance={account?.balance ?? "0"}
        />

       <KatarinaCard
  onOpen={() => {
    setChatOpen(true);
    setChatMinimized(false);
  }}
  insights={insights}
  loading={insightsLoading}
/>

        <QuickActions
          onDeposit={() =>
            setModalType("deposit")
          }
          onWithdraw={() =>
            setModalType("withdraw")
          }
          onTransfer={() =>
            setModalType("transfer")
          }
        />

        <TransactionList
          transactions={
            account?.transactions ?? []
          }
        />
      </section>

      <TransferModal
        open={modalType === "transfer"}
        balance={account?.balance ?? "0"}
        onClose={() => setModalType(null)}
        onConfirm={handleTransfer}
      />

      <TransactionModal
        open={modalType === "deposit"}
        title="Depositar dinheiro"
        actionLabel="Depositar"
        onClose={() => setModalType(null)}
        onConfirm={handleDeposit}
      />

      <TransactionModal
        open={modalType === "withdraw"}
        title="Sacar dinheiro"
        actionLabel="Sacar"
        onClose={() => setModalType(null)}
        onConfirm={handleWithdraw}
      />

      <KatarinaChat
  open={chatOpen}
  minimized={chatMinimized}
  onMinimize={() => setChatMinimized(true)}
  onRestore={() => setChatMinimized(false)}
  onClose={() => setChatOpen(false)}
/>
    </main>
  );
}
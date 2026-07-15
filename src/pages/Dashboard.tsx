import { useEffect, useState } from "react";
import axios from "axios";


import { BalanceCard } from "../components/BalanceCard";
import { DashboardHeader } from "../components/DashboardHeader";
import { QuickActions } from "../components/QuickActions";
import { TransactionList } from "../components/TransactionList";
import { TransactionModal } from "../components/TransactionModal";
import { useAccount } from "../hooks/useAccount";
import { api } from "../services/api";
import { TransferModal } from "../components/TransferModal";

export function Dashboard() {
  const { account, loading, reload } = useAccount();

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

  if (loading) {
  return (
    <main className="dashboard-state">
      <div className="loading-spinner" />
      <span>Carregando sua conta...</span>
    </main>
  );
}

  async function handleDeposit(amount: number) {
  try {
    await api.post("/account/deposit", { amount });

    setMessage("✅ Depósito realizado com sucesso");
    await reload();
  } catch (error) {
    let errorMessage = "Erro ao realizar depósito.";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ?? errorMessage;
    }

    setMessage(`❌ ${errorMessage}`);
  }
}
 async function handleWithdraw(amount: number) {
  try {
    await api.post("/account/withdraw", { amount });

    setMessage("✅ Saque realizado com sucesso");
    await reload();
  } catch (error) {
    let errorMessage = "Erro ao realizar saque.";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ?? errorMessage;
    }

    setMessage(`❌ ${errorMessage}`);
  }
}
 async function handleTransfer(
  receiverEmail: string,
  amount: number
) {
  try {
    await api.post("/account/transfer", {
      receiverEmail,
      amount,
    });

    setMessage("✅ Transferência realizada com sucesso");
    await reload();
  } catch (error) {
    let errorMessage = "Erro ao realizar transferência.";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ?? errorMessage;
    }

    setMessage(`❌ ${errorMessage}`);
  }
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

          <h1>Olá, {account?.user.name} 👋</h1>
        </div>

        {message && (
  <div className="success-message">
    {message}
  </div>
)}

        <BalanceCard
          balance={account?.balance ?? "0"}
        />

        <QuickActions
          onDeposit={() => setModalType("deposit")}
          onWithdraw={() => setModalType("withdraw")}
          onTransfer={() => setModalType("transfer")}
        />

        <TransactionList
          transactions={account?.transactions ?? []}
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
    </main>
  );
  
}
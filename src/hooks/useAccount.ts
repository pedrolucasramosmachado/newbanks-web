import { useEffect, useState } from "react";
import { api } from "../services/api";

type Transaction = {
  id: string;
  type: string;
  amount: string;
  description: string;
  createdAt: string;
};

type Account = {
  balance: string;
  user: {
    name: string;
    email: string;
  };
  transactions: Transaction[];
};

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAccount() {
    try {
      const response = await api.get("/account");

      setAccount(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccount();
  }, []);

  return {
    account,
    loading,
    reload: loadAccount,
  };
}
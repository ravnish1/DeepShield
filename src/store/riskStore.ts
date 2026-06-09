import { create } from "zustand";
import type { Transaction } from "../types";
import { transactions as initialTransactions } from "../data/transactions";

interface Filters {
  status: "All" | "clear" | "flagged" | "review";
  minRisk: number | "";
  maxRisk: number | "";
  search: string;
}

interface RiskState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  selectedTransaction: Transaction | null;
  isDrawerOpen: boolean;
  filters: Filters;
  sortConfig: { key: keyof Transaction; direction: "asc" | "desc" } | null;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setSort: (key: keyof Transaction) => void;
  applyFilters: () => void;
  openDrawer: (transaction: Transaction) => void;
  closeDrawer: () => void;
  updateTransactionStatus: (id: string, status: "clear" | "flagged" | "review") => void;
  bulkUpdateStatus: (ids: string[], status: "clear" | "flagged" | "review") => void;
}

const defaultFilters: Filters = {
  status: "All",
  minRisk: "",
  maxRisk: "",
  search: "",
};

export const useRiskStore = create<RiskState>((set, get) => ({
  transactions: initialTransactions,
  filteredTransactions: initialTransactions,
  selectedTransaction: null,
  isDrawerOpen: false,
  filters: defaultFilters,
  sortConfig: null,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().applyFilters();
  },

  setSort: (key) => {
    set((state) => {
      let direction: "asc" | "desc" = "asc";
      if (state.sortConfig && state.sortConfig.key === key && state.sortConfig.direction === "asc") {
        direction = "desc";
      }
      return { sortConfig: { key, direction } };
    });
    get().applyFilters();
  },

  applyFilters: () => {
    set((state) => {
      const { status, minRisk, maxRisk, search } = state.filters;
      const filtered = state.transactions.filter((t) => {
        const matchesStatus = status === "All" || t.status === status;
        const matchesMinRisk = minRisk === "" || t.riskScore >= minRisk;
        const matchesMaxRisk = maxRisk === "" || t.riskScore <= maxRisk;
        const searchLower = search.toLowerCase();
        const matchesSearch =
          search === "" ||
          t.name.toLowerCase().includes(searchLower) ||
          t.email.toLowerCase().includes(searchLower);

        return matchesStatus && matchesMinRisk && matchesMaxRisk && matchesSearch;
      });
      
      const currentSortConfig = state.sortConfig;
      if (currentSortConfig) {
        const sortKey = currentSortConfig.key;
        const sortDir = currentSortConfig.direction;
        filtered.sort((a, b) => {
          const valA = a[sortKey];
          const valB = b[sortKey];
          if (typeof valA === "number" && typeof valB === "number") {
            return sortDir === "asc" ? valA - valB : valB - valA;
          }
          const strA = String(valA ?? "");
          const strB = String(valB ?? "");
          return sortDir === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
      }

      return { filteredTransactions: filtered };
    });
  },

  openDrawer: (transaction) => {
    set({ selectedTransaction: transaction, isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false, selectedTransaction: null });
  },

  updateTransactionStatus: (id, status) => {
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        t.id === id ? { ...t, status } : t
      );
      return { transactions: newTransactions };
    });
    useRiskStore.getState().applyFilters();
  },

  bulkUpdateStatus: (ids, status) => {
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        ids.includes(t.id) ? { ...t, status } : t
      );
      return { transactions: newTransactions };
    });
    useRiskStore.getState().applyFilters();
  },
}));

import { create } from "zustand";

const useLogsStore = create((set) => ({
  logs: [],
  loading: false,
  errors: [],
  pageState: null,
  limit: 25,
  setLogs: (newLogs) => set((state) => ({ logs: [...newLogs] })),
  // setLogs: (newLogs) => set((state) => ({ logs: [...state.logs, ...newLogs] })),
  setPageState: (newPageState) => set(() => ({ pageState: newPageState })),
  setLimit: (newLimit) => set(() => ({ limit: newLimit })),
  setLoading: (newLoading) => set(() => ({ loading: newLoading })),
  setErrors: (newErrors) => set(() => ({ errors: newErrors })),
  resetLogs: () => set(() => ({ logs: [], pageState: null })),
}));

export default useLogsStore;

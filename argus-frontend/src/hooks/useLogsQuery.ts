import { useEffect, useCallback } from "react";
import useLogsStore from "@/stores/data-store";

const fetchLogs = async (pageState, limit) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/data?limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_state: pageState }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch logs");
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const useLogsQuery = () => {
  const { pageState, limit, setLogs, setPageState, setErrors, setLoading } = useLogsStore();

  const fetchAndSetLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLogs(pageState, limit);
      setLogs(data.logs);
      setPageState(data.nextPageState);
    } catch (error) {
      setErrors(error);
    } finally {
      setLoading(false);
    }
  }, [pageState, limit, setLogs, setPageState, setErrors, setLoading]);

  useEffect(() => {
    fetchAndSetLogs();
  }, [fetchAndSetLogs]); 

  return {
    fetchAndSetLogs,
  };
};

export default useLogsQuery;

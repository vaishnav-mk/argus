import { Log } from "@/interfaces/log";

export const LogApi = {
  fetchLogs: async (pageState, limit): Promise<Log[]> => {
    const url = "/api/data";

    const response = await fetch(`http://localhost:3000/api/data?limit=${limit}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_state: "" }),
    }).catch((error) => {
      console.error("Error:", error);
    });
    if (!response.ok) {
      console.log("not safe"*100);
      throw new Error("Failed to fetch logs");
    }
    console.log("safe");
    return {"logs": "balls", "nextPageState": ""};
    return response.json();
  },
  getSpecificLog: async (id: string): Promise<Log> => {
    const response = await fetch(`/api/logs/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch specific log");
    }
    return response.json();
  },
};

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllLogs = createAsyncThunk("logs/getAll", async (pageState) => {
  const response = await fetch(`/api/data`, {
    credentials: "include",
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      pageState: pageState || "",
      limit: 25,
    }),
  });
  return response.json();
});

export const searchLogs = createAsyncThunk(
  "logs/searchLogs",
  async (searchOptions) => {
    const response = await fetch(`/api/search`, {
      credentials: "include",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(searchOptions),
    });
    return response.json();
  }
);

const dataSlice = createSlice({
  name: "logs",
  initialState: {
    logs: [],
    isLoading: false,
    nextPageState: "",
    isError: false,
  },
  reducers: {
    setNextPageState: (state, action) => {
      state.nextPageState = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.logs) {
          state.logs = action.payload.logs;
        }
        if (action.payload.isError) state.isError = true;
        if (action.payload.error) state.errorMessage = action.payload.error;
      })
      .addCase(getAllLogs.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(searchLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchLogs.fulfilled, (state, action) => {
        console.log({ action });
        state.isLoading = false;
        if (action.payload.logs) {
          state.logs = action.payload.logs;
        }
        if (action.payload.isError) state.isError = true;
        if (action.payload.error) state.errorMessage = action.payload.error;
      })
      .addCase(searchLogs.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setNextPageState } = dataSlice.actions;

export default dataSlice.reducer;

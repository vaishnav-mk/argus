import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const NEXT_PUBLIC_API_URL = "http://localhost:5000/api";

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

// export const createViolationAppeal = createAsyncThunk(
//   "violations/appeal",
//   async (appealData) => {
//     console.log({ appealData });
//     const response = await fetch(
//       `${NEXT_PUBLIC_API_URL}/violations/${appealData?.violationId}/appeal`,
//       {
//         credentials: "include",
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(appealData),
//       }
//     );
//     return response.json();
//   }
// );

const dataSlice = createSlice({
  name: "logs",
  initialState: {
    logs: [],
    isLoading: false,
    nextPageState: "",
    isError: false,
  },
  reducers: {
    // setViolationAppeal: (state, action) => {
    //   console.log({ action });
    //   const { violationId } = action.payload;
    //   const violationIndex = state.violations.findIndex(
    //     (violation) => violation._id === violationId
    //   );
    //   console.log({ violationIndex });
    //   if (violationIndex !== -1) {
    //     console.log({ violationIndex });
    //     state.selectedViolation = state.violations[violationIndex];
    //   }
    // },
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
          //   state.violations = action.payload.violations;
        }
        if (action.payload.isError) state.isError = true;
        if (action.payload.error) state.errorMessage = action.payload.error;
      })
      .addCase(getAllLogs.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    //   .addCase(createViolationAppeal.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(createViolationAppeal.fulfilled, (state, action) => {
    //     console.log({ action, state });
    //     state.isLoading = false;
    //     if (action.payload.isError) state.isError = true;
    //     if (action.payload.error) state.errorMessage = action.payload.error;
    //     const { unban, message, reason } = action.payload;
    //     if (!unban) {
    //       state.selectedViolation.status = "APPEAL_REJECTED";
    //       state.isError = true;
    //       state.selectedViolation.appealResponse = {
    //         unban: false,
    //         message,
    //         reason,
    //       };
    //       if (reason) state.errorMessage = `Appeal was not successful`;
    //     } else {
    //       state.selectedViolation.appealResponse = {
    //         unban: true,
    //         message,
    //         reason,
    //       };
    //       state.isError = true;
    //       state.selectedViolation.status = "APPEALED";
    //       state.errorMessage = reason || "Appeal was successful.";
    //     }
    //   })
    //   .addCase(createViolationAppeal.rejected, (state) => {
    //     state.isLoading = false;
    //     state.isError = true;
    //   });
  },
});

export const { setNextPageState } = dataSlice.actions;
// export const { setViolationAppeal } = violationSlice.actions;

export default dataSlice.reducer;
// export default violationSlice.reducer;

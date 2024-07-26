import dataSlice from "../slice/dataSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
  reducer: {
    data: dataSlice,
  },
});

export default store;

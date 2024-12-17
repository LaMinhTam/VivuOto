import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICarStatistics, ICarStatisticsByProvince, IRentalContractSummary, IStatisticInvoice, IUserContractSummary, StatisticState } from "./types";

const initialState: StatisticState = {
    userContractSummary: [],
    statisticInvoice: [],
    rentalContractSummary: [],
    carStatistics: [],
    carStatisticsByProvince: [],
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        setUserContractSummary(state, action: PayloadAction<IUserContractSummary[]>) {
            state.userContractSummary = action.payload;
        },
        setStatisticInvoice(state, action: PayloadAction<IStatisticInvoice[]>) {
            state.statisticInvoice = action.payload;
        },
        setRentalContractSummary(state, action: PayloadAction<IRentalContractSummary[]>) {
            state.rentalContractSummary = action.payload;
        },
        setCarStatistics(state, action: PayloadAction<ICarStatistics[]>) {
            state.carStatistics = action.payload;
        },
        setCarStatisticsByProvince(state, action: PayloadAction<ICarStatisticsByProvince[]>) {
            state.carStatisticsByProvince = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { 
    setUserContractSummary, 
    setStatisticInvoice, 
    setRentalContractSummary, 
    setCarStatistics, 
    setCarStatisticsByProvince,
    setLoading, 
    setError
 } = profileSlice.actions;
export default profileSlice.reducer;
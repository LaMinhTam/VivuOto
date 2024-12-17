import { IMetaData } from '../rental/types';
import {CarDetail, ICar, IReview} from './types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ICarState {
  carDetail: CarDetail;
  cars: ICar[];
  loading: boolean;
  error: null | string;
  meta: IMetaData
}

const initialState: ICarState = {
  carDetail: {} as CarDetail,
  cars: [],
  loading: false,
  error: null,
  meta: {} as IMetaData,
};

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    getCars(state) {
      state.loading = true;
      state.error = null;
    },
    getCarsSuccess(state, action: PayloadAction<ICar[]>) {
      state.cars = action.payload;
      state.loading = false;
      state.error = null;
    },
    getCarsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    getCarDetail(state) {
      state.loading = true;
      state.error = null;
    },
    getCarDetailSuccess(state, action: PayloadAction<CarDetail>) {
      state.carDetail = action.payload;
      state.loading = false;
      state.error = null;
    },
    getCarDetailFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setMetaData: (state, action: PayloadAction<IMetaData>) => {
      state.meta = action.payload;
    },
  },
});

export const {
  getCars,
  getCarsSuccess,
  getCarsFailed,
  getCarDetail,
  getCarDetailSuccess,
  getCarDetailFailed,
  setMetaData
} = carSlice.actions;
export default carSlice.reducer;

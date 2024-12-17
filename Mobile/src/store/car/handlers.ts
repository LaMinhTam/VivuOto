import {call, put} from 'redux-saga/effects';
import {CarDetail, ICar, ICreateCarData, IQueryCarOwner, IQuerySearchCar} from './types';
import {axiosInstance, axiosPrivate} from '../../apis/axios';
import {ENDPOINTS, QuerySearchCar} from './models';
import {
  getCarDetailFailed,
  getCarDetailSuccess,
  getCars,
  getCarsFailed,
  getCarsSuccess,
  setMetaData,
} from './reducers';
import { IMetaData } from '../rental/types';
import { AxiosResponse } from 'axios';

interface ICarResponse {
  code: number;
  message: string;
  data: ICar[];
  meta?: IMetaData;
}

interface ICarDetailResponse {
  code: number;
  message: string;
  data: CarDetail;
}


interface ICarResponse {
  code: number;
  message: string;
  data: ICar[];
  meta?: IMetaData;
}

function* searchCar(action: {
  type: string;
  payload: IQuerySearchCar;
}) {
  try {
    yield put(getCars());
    const response: AxiosResponse<ICarResponse> = yield call(
      axiosInstance.get,
      ENDPOINTS.SEARCH,
      {
        params: action.payload,
      }
    );
    yield put(setMetaData(response?.data?.meta as IMetaData));
    yield put(getCarsSuccess(response.data.data));
  } catch (error) {
    const typedError = error as Error;
    yield put(getCarsFailed(typedError.message));
  }
}

async function searchCarHomePage(params: IQuerySearchCar) {
  try {
    const response = await axiosInstance.get(ENDPOINTS.SEARCH, {
      params,
    });
    if (response?.data?.code === 200) {
      return {
        success: true,
        data: response?.data?.data,
        message: response?.data?.message,
        meta: response?.data?.meta,
      };
    }
  } catch (error) {
    const typedError = error as Error;
    return {
      success: false,
      data: [],
      meta: {} as IMetaData,
      message: typedError.message,
    };
  }
}

function* getCarDetail(action: { type: string; payload: string }) {
  try {
    yield put(getCars());
    const response: AxiosResponse<ICarDetailResponse> = yield call(
      axiosInstance.get,
      ENDPOINTS.FIND_CAR_BY_ID(action.payload)
    );
    yield put(getCarDetailSuccess(response.data.data));
  } catch (error) {
    const typedError = error as Error;
    yield put(getCarDetailFailed(typedError.message));
  }
}

async function getMyCars(params: IQueryCarOwner) {
  try {
    const response: AxiosResponse<ICarResponse> =
      await axiosPrivate.get(ENDPOINTS.MY_CARS, {
        params,
      });
    if (response?.data?.code === 200) {
      return {
        success: true,
        data: response?.data?.data,
        message: response?.data?.message,
        meta: response?.data?.meta,
      };
    }
  } catch (error) {
    const typedError = error as Error;
    return {
      success: false,
      data: [],
      meta: {} as IMetaData,
      message: typedError.message,
    };
  }
}

export const createCar = async (data: ICreateCarData) => {
  try {
    const response = await axiosPrivate.post(
      ENDPOINTS.CREATE_CAR,
      data
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const typedError = error as Error;
    return {
      success: false,
      message: typedError.message,
    };
  }
};

export const updateCar = async (data: ICreateCarData, id: string) => {
  try {
    const response = await axiosPrivate.put(
      ENDPOINTS.UPDATE_CAR(id),
      data
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const typedError = error as Error;
    return {
      success: false,
      message: typedError.message,
    };
  }
};

export const deleteCar = async (id: string) => {
  try {
    const response = await axiosPrivate.delete(
      ENDPOINTS.DELETE_CAR(id)
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const typedError = error as Error;
    return {
      success: false,
      message: typedError.message,
    };
  }
};

export {searchCar, getCarDetail, getMyCars, searchCarHomePage};

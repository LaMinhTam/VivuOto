import { AxiosError, AxiosResponse } from "axios";
import { axiosPrivate } from "../../apis/axios";
import { UpdateCitizenIdentificationPayload, UpdateLicensePayload, UpdateProfilePayload } from "./types";
import { IUser } from "../auth/types";
import { ENDPOINTS } from "./models";
import { call, put } from "redux-saga/effects";
import { fetchGetMe, getMeFailed, getMeSuccess } from "./reducers";

interface IUserResponse {
    code: number;
    message: string;
    data: IUser;
  }

interface IUpdateProfileResponse {
    data: IUser;
    code: number;
    message: string;
}

interface IUpdateMetaMaskAddressResponse {
    code: number;
    message: string;
    data?: string
}

export function* getMe() {
    try {
      yield put(fetchGetMe());
      const response: AxiosResponse<IUserResponse> = yield call(
        axiosPrivate.get,
        ENDPOINTS.GET_ME,
      );
      yield put(getMeSuccess(response.data.data));
    } catch (error: any) {
      yield put(getMeFailed(error.message));
    }
  }

export const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
        const response = await axiosPrivate.put(ENDPOINTS.UPDATE_PROFILE, payload);
        const { data, code } = response.data as IUpdateProfileResponse;
        if(code === 200) {
            return {success: true, data};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, data: null};
    }
}

export const updateLicense = async (payload: UpdateLicensePayload) => {
    try {
        const response: AxiosResponse<IUpdateProfileResponse> = await axiosPrivate.put(ENDPOINTS.UPDATE_LICENSE, payload);
        const { data, code } = response.data;
        if(code === 200) {
            return {success: true, data};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, data: null};
    }
}

export const updateCitizenLicense = async (payload: UpdateCitizenIdentificationPayload) => {
    try {
        const response: AxiosResponse<IUpdateProfileResponse> = await axiosPrivate.put(ENDPOINTS.UPDATE_CITIZEN_IDENTIFICATION, payload);
        const { data, code } = response.data;
        if(code === 200) {
            return {success: true, data};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, data: null};
    }
}

export const updateMetamaskAddress = async (metamaskAddress: string) => {
    try {
        const response: AxiosResponse<IUpdateMetaMaskAddressResponse> = await axiosPrivate.put(ENDPOINTS.UPDATE_METAMASK_ADDRESS, {address: metamaskAddress});
        const { message, code } = response.data;
        if(code === 200) {
            return {success: true, message};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, message: null};
    }
}

export const buyToken = async () => {
    try {
        const response: AxiosResponse<IUpdateMetaMaskAddressResponse> = await axiosPrivate.post(ENDPOINTS.BUY_TOKEN);
        const { data, code } = response.data;
        if(code === 200) {
            return {success: true, data};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, data: null};
    }
}

export const changePassword = async (old_password: string, new_password: string) => {
    try {
        const response = await axiosPrivate.post(ENDPOINTS.CHANGE_PASSWORD, {old_password, new_password});
        const { message, code } = response.data;
        if(code === 200) {
            return {success: true, message};
        }else {
            return {success: false, message};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, message: null};
    }
}
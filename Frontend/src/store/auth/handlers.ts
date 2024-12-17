import { ENDPOINTS } from "./models";
import { axiosInstance, axiosPrivate } from "../../apis/axios";
import {
  ILoginResponse,
  INotification,
  INotificationParams,
  IRegisterResponseData,
} from "./types";
import { loginFailure, loginRequest, loginSuccess } from "./reducers";
import { AxiosResponse } from "axios";
import { saveAccessToken, saveRefreshToken } from "../../utils";
import { generateToken } from "../../config/firebaseConfig";
import { IMetaData } from "../rental/types";

interface IRegisterResponse {
  code: number;
  message: string;
  data: IRegisterResponseData
}

interface INotificationResponse {
  code: number;
  message: string;
  data: INotification[];
  meta: IMetaData;
}

interface IRefreshToken {
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  }
}

async function login(email: string, password: string) {
  try {
    loginRequest();
    const response: AxiosResponse<ILoginResponse> =
      await axiosInstance.post(ENDPOINTS.LOGIN, { email, password });
    if (response.data.code === 200) {
      const {
        access_token,
        refresh_token,
        id,
        display_name,
        email,
        image_url,
      } = response.data.data;
      const user = {
        id,
        display_name,
        email,
        image_url,
      };
      saveAccessToken(access_token);
      saveRefreshToken(refresh_token);
      loginSuccess(user);
      return {
        success: response.data.code === 200,
        token: access_token,
        message: response?.data?.message ?? null,
      };
    }else {
      return { success: false, token: null, message: response?.data?.message?? null };
    }
  } catch (error) {
    const typedError = error as Error;
    loginFailure(typedError.message);
    return { success: false, token: null, message: null, };
  }
}

async function register(name: string, email: string, password: string) {
  try {
    const response: AxiosResponse<IRegisterResponse> = await axiosInstance.post(ENDPOINTS.SIGN_UP, {
      name,
      email,
      password,
    });
    if(response.data.code === 200) {
      return { success: true, data: response.data.data, message: response?.data?.message ?? null };
    }else {
      return { success: false, data: null, message: response?.data?.message?? null };
    }
  } catch (error) {
    const typedError = error as Error;
    console.error(typedError.message);
    return { success: false, data: null };
  }
}

async function verifyEmail(email: string, code: string) {
  try {
    const response = await axiosInstance.post(ENDPOINTS.VERIFY_EMAIL, { email, verification_code: code });
    if(response.data.code === 200) {
      const {
        access_token,
        refresh_token,
      } = response.data.data;
      saveAccessToken(access_token);
      saveRefreshToken(refresh_token);
      return { success: true, data: access_token, message: response?.data?.message ?? null };
    }else {
      return { success: false, data: null, message: response?.data?.message?? null };
    }
  } catch (error) {
    const typedError = error as Error;
    console.error(typedError.message);
    return { success: false, data: null };
  }
}

async function subscribeDevice() {
  const token = await generateToken();
  if (token) {
    const response = await axiosInstance.post(
      ENDPOINTS.SUBSCRIBE_DEVICE(token)
    );
    return response.data;
  }
}

async function getListNotifications(payload: INotificationParams) {
  try {
    const response: AxiosResponse<INotificationResponse> =
      await axiosPrivate.get(ENDPOINTS.GET_NOTIFICATIONS, {
        params: payload,
      });
    const { code, data, meta } = response.data;
    if (code === 200) {
      return { success: true, data, meta };
    }
  } catch (error) {
    const typedError = error as Error;
    console.log("getListNotifications ~ typedError:", typedError);
    return { success: false, data: [], meta: {} as IMetaData };
  }
}

async function handleMakeNotificationAsRead(id: string) {
  try {
    const response = await axiosPrivate.put(
      ENDPOINTS.MAKE_AS_READ(id)
    );
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data as INotification,
      };
    }
  } catch (error) {
    console.log("handleMakeNotificationAsRead ~ error:", error);
    return { success: false, data: {} as INotification };
  }
}

async function handleForgotPassword(email: string) {
  try {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    if (response.data.code === 200) {
      return { success: true, message: response.data.message };
    }else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const typedError = error as Error;
    console.error("handleForgotPassword ~ error:", typedError.message);
    return { success: false, message: null };
  }
}

async function handleResetPassword(
  email: string,
  otp: string,
  new_password: string
) {
  try {
    const response = await axiosInstance.post(ENDPOINTS.RESET_PASSWORD, {
      email,
      otp,
      new_password,
    });
    if (response.data.code === 200) {
      return { success: true, message: response.data.message };
    }else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const typedError = error as Error;
    console.error("handleResetPassword ~ error:", typedError.message);
    return { success: false, message: null };
  }
}

async function fetchRefreshToken(refreshToken: string) {
  try {
    const response: AxiosResponse<IRefreshToken> = await axiosPrivate.post(ENDPOINTS.REFRESH_TOKEN, { refresh_token: refreshToken });
    if (response.data.code === 200) {
      const {
        access_token,
        refresh_token,
      } = response.data.data;
      saveAccessToken(access_token);
      saveRefreshToken(refresh_token);
      return { success: true, message: response.data.message, data: { access_token, refresh_token } };
    }else {
      return { success: false, message: response.data.message, data: null };
    }
  } catch (error) {
    const typedError = error as Error;
    console.error("refreshToken ~ error:", typedError.message);
    return { success: false, message: null, data: null };
  }
}

export {
  login,
  subscribeDevice,
  getListNotifications,
  handleMakeNotificationAsRead,
  register,
  verifyEmail,
  handleForgotPassword,
  handleResetPassword,
  fetchRefreshToken
};

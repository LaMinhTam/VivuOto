import React, { useEffect } from "react";
import { JSX } from "react/jsx-runtime";
import { AuthContextType } from "../types/common";
import { getAccessToken, isTokenExpire, saveAccessToken, saveRefreshToken, saveUser } from "../utils";
import { generateToken } from "../config/firebaseConfig";
import { axiosPrivate } from "../apis/axios";
import { ENDPOINTS, NotificationParams } from "../store/auth/models";
import { INotification } from "../store/auth/types";
import { IMetaData } from "../store/rental/types";
import { getListNotifications } from "../store/auth/handlers";
import { handleDecodeJWT } from "../utils/helper";

const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider(
  props: JSX.IntrinsicAttributes &
    React.ProviderProps<AuthContextType>
) {
  const [isLogged, setIsLogged] = React.useState(false);
  const role = (() => {
    try {
      return JSON.parse(localStorage.getItem('ROLES') || 'null');
    } catch (error) {
      console.error('Error parsing roles from localStorage:', error);
      return null;
    }
  })();

  const [notifications, setNotifications] = React.useState<{
    data: INotification[];
    meta: IMetaData;
  }>({
    data: [],
    meta: {} as IMetaData,
  });
  const accessToken = getAccessToken();
  useEffect(() => {
    if (accessToken && !isTokenExpire(accessToken)) {
      setIsLogged(true);
    } else {
      saveAccessToken("");
      saveRefreshToken("");
      saveUser("");
      setIsLogged(false);
    }
  }, [accessToken])

  useEffect(() => {
    async function subscribeDevice() {
      const token = await generateToken();
      if (token) {
        const response = await axiosPrivate.post(
          ENDPOINTS.SUBSCRIBE_DEVICE(token)
        );
        if (response?.data?.code === 200) {
          // saveUserInfoToCookie(response.data.data, accessToken || "");
        }
      }
    }
    if (isLogged) {
      subscribeDevice();
    }
  }, [accessToken, isLogged])

  useEffect(() => {
    const data = handleDecodeJWT(accessToken || "");
    if (data && data?.roles.length > 0) {
      localStorage.setItem('ROLES', JSON.stringify(data?.roles?.[0]?.authority));
    }
  }, [isLogged, accessToken])

  useEffect(() => {
    async function fetchNotifications() {
      const response = await getListNotifications(NotificationParams);
      if (response?.success && response.data && response.meta) {
        setNotifications({
          data: response.data,
          meta: response.meta,
        })
      }
    }
    if (isLogged) {
      fetchNotifications();
    }
  }, [isLogged])

  const contextValues = {
    isLogged,
    setIsLogged,
    notifications,
    setNotifications,
    role,
  };
  return <AuthContext.Provider
    {...props}
    value={contextValues}
  ></AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}
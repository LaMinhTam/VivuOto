import { INotification } from "../store/auth/types";
import { IMetaData } from "../store/rental/types";

export interface AuthContextType {
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
  notifications: {
    data: INotification[];
    meta: IMetaData;
  };
  setNotifications: (notifications: {
    data: INotification[];
    meta: IMetaData;
  }) => void;
  role: string | null;
}

export interface DecodedToken {
  roles: { authority: string }[];
  id: { timestamp: number; date: number };
  type: string;
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

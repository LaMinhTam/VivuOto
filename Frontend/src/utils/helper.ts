import dayjs, { Dayjs } from "dayjs";
import { jwtDecode } from "jwt-decode";
import numeral from "numeral";
import { DecodedToken } from "../types/common";
import { convertDateToTimestamp, saveAccessToken, saveRefreshToken, saveUserInfoToCookie } from ".";
import { NavigateFunction } from "react-router-dom";
import { fetchRefreshToken } from "../store/auth/handlers";
import { getMe } from "../store/profile/handlers";
import { IUser } from "../store/auth/types";
import { toast } from "react-toastify";
import { TFunction } from "i18next";

export function formatDateToDDMMYYYY(date: Date) {
    return dayjs(date).format('DD-MM-YYYY');
}

export function formatDateToDDMMYYYYHHMMSS(date: Date) {
    return dayjs(date).format('DD-MM-YYYY HH:mm:ss');
}

export function formatDateToDDMM (date: string) {
    return dayjs(date).format('DD/MM');
}

export const formatPrice = (price: number) => {
    return numeral(price).format("0,0");
};

export const getDateRange = (range: 'date' | 'week' | 'month' | 'year'): [Dayjs, Dayjs] => {
    const now = dayjs();
    let startDate: Dayjs;
    let endDate: Dayjs;

    switch (range) {
        case 'date':
            startDate = now.startOf('day');
            endDate = now.endOf('day');
            break;
        case 'week':
            startDate = now.startOf('week');
            endDate = now.endOf('week');
            break;
        case 'month':
            startDate = now.startOf('month');
            endDate = now.endOf('month');
            break;
        case 'year':
        default:
            startDate = now.startOf('year');
            endDate = now.endOf('year');
            break;
    }

    return [startDate, endDate];
};

export const handleDecodeJWT = (token: string): DecodedToken | null => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const replaceSpacesWithUnderscores = (str: string): string => {
    return str.replace(/\s+/g, '_');
};

export const convertTimestampToDayjs = (timestamp: number | null): dayjs.Dayjs | null => {
    if (timestamp === null || !timestamp) {
      return null;
    }
    const seconds = timestamp?.toString()?.length === 13 ? Math.floor(timestamp / 1000) : timestamp;
    return dayjs.unix(seconds);
};

export const handleGenerateViewAllCarsLink = () => {
    const startDateTimestamp = convertDateToTimestamp(dayjs().toDate()?.toDateString());
    const endDateTimestamp = convertDateToTimestamp(dayjs().add(2, 'day').toDate()?.toDateString());
    return `/cars/filter?startDate=${startDateTimestamp}&endDate=${endDateTimestamp}&province=Ho_Chi_Minh`
}

export async function handleRefreshToken(
    accessToken: string,
    refreshToken: string,
    navigate: NavigateFunction,
    t: TFunction<"translation", undefined>
) {
    try {
        if (accessToken && refreshToken) {
            const response = await fetchRefreshToken(refreshToken)
            if (response?.success) {
                const meResponse = await getMe();
                if (meResponse?.success) {
                    saveAccessToken(response.data?.access_token ?? '');
                    saveRefreshToken(response.data?.refresh_token ?? '');
                    saveUserInfoToCookie(
                        meResponse.data ?? {} as IUser,
                        response.data?.access_token ?? ''
                    );
                }

            }
        }
    } catch (error) {
        console.error("handleRefreshToken ~ error:", error);
        saveAccessToken("");
        saveRefreshToken("");
        toast.error(t("auth.sessionExpired"));
        navigate("/signin");
    }
}
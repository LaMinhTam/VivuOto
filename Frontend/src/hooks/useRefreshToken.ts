import { useNavigate } from "react-router-dom";
import { getAccessToken, getRefreshToken } from "../utils";
import { handleRefreshToken } from "../utils/helper";
import { useTranslation } from "react-i18next";

export default function useRefreshToken() {
    let isRefreshingToken = false;
    const {t} = useTranslation();
    const navigate = useNavigate();
    const refreshTokenHandler = async () => {
        if (isRefreshingToken) {
            return new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (!isRefreshingToken) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
        isRefreshingToken = true;
        const refreshToken = getRefreshToken() ?? "";
        const accessToken = getAccessToken() ?? "";
        try {
            await handleRefreshToken(accessToken, refreshToken, navigate, t);
        } finally {
            isRefreshingToken = false;
        }
    };

    return refreshTokenHandler;
}
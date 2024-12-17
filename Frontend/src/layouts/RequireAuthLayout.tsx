
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getRefreshToken, isTokenExpire, saveAccessToken, saveRefreshToken } from "../utils";
import useRefreshToken from "../hooks/useRefreshToken";

const RequiredAuthLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    const accessToken = getAccessToken() ?? "";
    const refreshToken = getRefreshToken() ?? "";
    const isAccessTokenExpired = isTokenExpire(accessToken);
    const refreshTokenHandler = useRefreshToken();
    useEffect(() => {
        const isRefreshTokenExpired = isTokenExpire(refreshToken);
        async function handleExpiredToken() {
            if (
                isAccessTokenExpired &&
                !isRefreshTokenExpired &&
                !accessToken
            ) {
                console.log("Access token expired");
                refreshTokenHandler();
            } else if (!isAccessTokenExpired) {
                console.log("Access token not expired");
                return;
            } else {
                saveAccessToken("");
                saveRefreshToken("");
                navigate("/signin");
            }
        }
        handleExpiredToken();
    }, [accessToken, isAccessTokenExpired, navigate, refreshToken, refreshTokenHandler]);
    return <>{children}</>;
};

export default RequiredAuthLayout;
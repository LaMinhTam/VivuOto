import { useEffect } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { getAccessToken, isTokenExpire } from "../utils";
import { useNavigate } from "react-router-dom";

const LayoutAuthentication = ({ children }: { children: React.ReactNode }) => {
    const accessToken = getAccessToken();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isTokenExpire(accessToken ?? "") && accessToken) {
            navigate("/");
        }
    }, [accessToken, navigate])
    return (
        <>
            <div className="absolute z-50 right-2"><LanguageSelector /></div>
            <div className="w-full h-screen">
                {children}
            </div>
        </>
    );
};

export default LayoutAuthentication;
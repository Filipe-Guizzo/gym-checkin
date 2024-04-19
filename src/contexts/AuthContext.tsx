import Cookies from "js-cookie";
import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState(Cookies.get('JWT_TOKEN'));
    const navigate = useNavigate();

    const login = () => {
        setUser(Cookies.get('JWT_TOKEN'));
        navigate("/dashboard");
    };

    const logout = () => {
        Cookies.set('JWT_TOKEN', '');
        Cookies.set('USER_ID', '');
        Cookies.set('ROLE', '');
        setUser('');
        navigate("/");
    };

    const value: any = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
}
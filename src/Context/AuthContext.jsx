import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    
    const [isLoggedin, setIsLoggedin] = useState(localStorage.getItem("token") != null);

    return <AuthContext.Provider value={{ isLoggedin, setIsLoggedin }}>
        {children}
    </AuthContext.Provider>
}
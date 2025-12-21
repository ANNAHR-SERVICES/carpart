import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                
                if (parsedUser && parsedUser.role) {
                    setUser(parsedUser);
                } else {
                    throw new Error("Invalid user data");
                }
            } catch (e) {
                console.error(e);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData)); 
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const value = {
        user,
        login,
        logout,
        loading, 
        isAuthenticated: !!user, 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
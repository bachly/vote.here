import React, { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseApp";
import { getUserInfo } from "./firebaseMethods";

export const UserContext = React.createContext()

export function UserProvider({ children }) {
    const [user, loading, error] = useAuthState(auth);
    const value = {
        user,
        loadingUser: loading,
        errorLoadingUser: error
    }

    useEffect(async () => {
        if (user && user.email) {
            const info = await getUserInfo({ email: user.email });
            value.user = {
                email: user.email,
                ...value.user,
                ...info
            }
        }
    }, [user])

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
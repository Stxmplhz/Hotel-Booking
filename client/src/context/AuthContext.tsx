import { createContext, useEffect, useReducer, useState } from "react";
import type { ReactNode, Dispatch } from "react";
import type { User } from "../types"

interface AuthState {
    user: User | null;
    loading: boolean;
    error: any;
}

type Action =
    | { type: "LOGIN_START" }
    | { type: "LOGIN_SUCCESS"; payload: User }
    | { type: "LOGIN_FAILURE"; payload: any }
    | { type: "LOGOUT" };

const INITIAL_STATE: AuthState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
};

export const AuthContext = createContext<{
    user: User | null;
    loading: boolean;
    error: any;
    dispatch: Dispatch<Action>;
    isAuthModalOpen: boolean;
    modalMode: "login" | "register";
    openAuthModal: (mode?: "login" | "register") => void;
    closeAuthModal: () => void;
}>({
    ...INITIAL_STATE,
    dispatch: () => null,
    isAuthModalOpen: false,
    modalMode: "login",
    openAuthModal: () => {},
    closeAuthModal: () => {},
});

const AuthReducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case "LOGIN_START":
        return {
            user: null,
            loading: true,
            error: null,
        };
        case "LOGIN_SUCCESS":
        return {
            user: action.payload,
            loading: false,
            error: null,
        };
        case "LOGIN_FAILURE":
        return {
            user: null,
            loading: false,
            error: action.payload,
        };
        case "LOGOUT":
        return {
            user: null,
            loading: false,
            error: null,
        };
        default:
        return state;
    }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"login" | "register">("login");

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    const openAuthModal = (mode: "login" | "register" = "login") => {
        setModalMode(mode);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider
        value={{
            user: state.user,
            loading: state.loading,
            error: state.error,
            dispatch,
            isAuthModalOpen,
            modalMode,
            openAuthModal,
            closeAuthModal,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};
import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { user, openAuthModal } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            openAuthModal("login");
        }
    }, [user, openAuthModal])

    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
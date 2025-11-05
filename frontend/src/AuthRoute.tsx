import { useAuthStore } from "./store/AuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {

    const user = useAuthStore(state => state.user)
    const loading = useAuthStore(state => state.loading)
    const authChecked = useAuthStore(state => state.authChecked)

    if(!authChecked || loading) return

    return user ? <Outlet/> : <Navigate to="/login" replace />;
}
 
export default AuthRoute;
import { useAuthStore } from "./store/AuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {

    const user = useAuthStore(state => state.user)

    return user ? <Outlet/> : <Navigate to="/login" replace />;
}
 
export default AuthRoute;
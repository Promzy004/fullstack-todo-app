import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/AuthStore";

const UnAuthRoute = () => {

    const user = useAuthStore(state => state.user)

    return !user ? <Outlet/> : <Navigate to="/" replace />;
}
 
export default UnAuthRoute;
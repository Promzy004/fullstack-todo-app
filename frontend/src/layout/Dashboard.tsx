import { Outlet } from "react-router-dom";
import DesktopSidebar from "../components/DesktopSidebar";
import MobileSidebar from "../components/MobileSidebar";
import { useTodoStore } from "../store/TodoStore";


const Dashboard = () => {

    const showSidebar = useTodoStore(state => state.showSidebar)
    const setShowSidebar = useTodoStore(state => state.setShowSidebar)

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar (hidden on mobile) */}
            <DesktopSidebar />
            {showSidebar && <MobileSidebar />}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Top navbar */}
                <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    {/* Hamburger (mobile only) */}
                    <button
                        className="md:hidden p-2 rounded-md text-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        ☰
                    </button>

                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        TaskFlow
                    </h1>
                </header>

                {/* Content */}
                <Outlet />
            </div>
        </div>
    );
}
 
export default Dashboard;
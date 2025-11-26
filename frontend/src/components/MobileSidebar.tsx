import { useTodoStore } from "../store/TodoStore";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/AuthStore";
import { BeatLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";


interface ISidebarTabs {
    title: string,
    path: string,
    icon: ReactNode
}

const sidebarTabs: ISidebarTabs[] = [
    {
        title: "Todos",
        path: "/",
        icon: <GiNotebook />
    },
    {
        title: "Settings",
        path: "/settings",
        icon: <FaUser />
    }
]

const MobileSidebar = () => {

    const setShowSidebar = useTodoStore(state => state.setShowSidebar)

    const location = useLocation()
    const pathname = location.pathname
    const logout = useAuthStore(state => state.logout)
    const logoutLoading = useAuthStore(state => state.logoutLoading)

    const stop = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
    }
    
    return (
        <aside 
            className="w-full h-full fixed top-16 left-0 block md:hidden bg-black/30"
            onClick={() => setShowSidebar(false)}
        >
            <div 
                onClick={(e) => stop(e)}
                className="flex md:hidden h-full w-[60%] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex-col">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-8">
                    Menu
                </h2>

                <div className="flex flex-col justify-between h-full">
                    <nav className="space-y-4">
                        <nav className="space-y-4">
                            {sidebarTabs.map((tab, index) => (
                                <Link
                                    key={index}
                                    to={tab.path}
                                    onClick={() => setShowSidebar(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md  ${pathname === tab.path ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.title}</span>
                                </Link>
                            ))}
                        </nav>
                    </nav>

                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {logoutLoading ?
                            <BeatLoader color="#fff" loading={logoutLoading} size={10} />
                            :
                            <span>Logout</span> 
                        }
                    </button>
                </div>
            </div>
        </aside>
    );
}
 
export default MobileSidebar;
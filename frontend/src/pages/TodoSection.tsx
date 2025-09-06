import { useTodoStore } from "../store/TodoStore";

const TodoSection = () => {

    const activeProgressTab = useTodoStore(state => state.activeProgressTab)
    const setActiveProgressTab = useTodoStore(state => state.setActiveProgressTab)

    const porgressTab: string[] = ['All Tasks', 'Active', 'Completed']

    const handleActiveTab = (tab: string) => {
        setActiveProgressTab(tab)
    }

    return (
        <main className="flex flex-col items-center p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                Your productivity companion
                </p>
            </div>

            {/* Input + Add Task */}
            <div className="flex w-full max-w-xl space-x-2 mb-6">
                <input
                type="text"
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 
                            text-gray-900 dark:text-gray-100 
                            placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Add Task
                </button>
            </div>

            {/* Tabs */}
            <div className="flex w-full max-w-xl mb-6 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                {porgressTab.map((tab, index) => (
                    <button 
                        key={index}
                        className={`flex-1 px-4 py-2 transition-all duration-300 ${activeProgressTab === tab ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={() => handleActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <ul className="w-full max-w-xl space-y-4">
                <li className="flex items-center justify-between p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="form-checkbox" />
                    <span className="line-through text-gray-500 dark:text-gray-400">
                    Design new user interface mockups
                    </span>
                </div>
                <button className="px-2 py-1 text-red-500 hover:text-red-700">✕</button>
                </li>
                <li className="flex items-center justify-between p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="form-checkbox" />
                    <span className="text-gray-900 dark:text-gray-100">
                    Code review for backend APIs
                    </span>
                </div>
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                </li>
                <li className="flex items-center justify-between p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-gray-900 dark:text-gray-100">mmm</span>
                </div>
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                </li>
            </ul>
        </main>
    );
}
 
export default TodoSection;
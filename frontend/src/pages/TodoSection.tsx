import React, { useEffect, useState } from "react";
import { useTodoStore } from "../store/TodoStore";
import { useToastStore } from "../store/ToastStore";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddTaskModal from "../components/AddTaskModal";
import { useNavigate } from "react-router-dom";


const TodoSection = () => {

    const activeProgressTab = useTodoStore(state => state.activeProgressTab)
    const setActiveProgressTab = useTodoStore(state => state.setActiveProgressTab)
    const getAllTasks = useTodoStore(state => state.getAllTasks)
    const tasks = useTodoStore(state => state.tasks)
    const setTasks = useTodoStore(state => state.setTasks)
    const updateTask = useTodoStore(state => state.updateTask)
    const showToast = useToastStore(state => state.showToast);
    const deleteTask = useTodoStore(state => state.deleteTask)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navigate = useNavigate();

    const progressTab: string[] = ['All Tasks', 'Active', 'Completed']

    const handleActiveTab = (tab: string) => {
        setActiveProgressTab(tab)
    }

    //fetches all tasks on render
    useEffect(() => {
        const fetchTasks = async () => {
            const data = await getAllTasks()
            setTasks(data)
        }

        fetchTasks()
    }, [])


    // handles update tasks, either completed or not completed
    const handleUpdateTask = async (e: React.ChangeEvent<HTMLInputElement>, id: number, completed: boolean, title: string) => {
        e.preventDefault()
        await updateTask(id, completed);
        const data = await getAllTasks();
        setTasks(data);
        const message = (completed ? `(${title}) task marked as completed` : `(${title}) task marked as not completed`)
        const type = completed ? "success" : "info"
        showToast(message, type);
    }

    // handles each task delete
    const handleDeleteTask = async (e: React.MouseEvent<HTMLButtonElement> ,id: number, title: string) =>{
        e.preventDefault()
        await deleteTask(id)
        const data = await getAllTasks();
        setTasks(data);

        showToast(`${title} task deleted`, "error")
    }


    // filter tasks
    const filteredTasks = tasks.filter(task => {
        if (activeProgressTab === 'Active') return !task.completed;
        if (activeProgressTab === 'Completed') return task.completed;
        return true;
    });

    const navigateToDetail = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault()
        navigate(`/task/${id}`)
    }


    return (
        <main className="flex flex-col items-center p-6">
            <AddTaskModal open={isModalOpen} onClose={closeModal} />
            {/* Header */}
            <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                Your productivity companion
                </p>
            </div>

            {/* Search + Add Task */}
            <div className="flex w-full justify-between items-center max-w-xl space-x-2 mb-6">
                {/* <input
                    type="text"https://fullstack-todo-app-production-f8a3.up.railway.app
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-100  placeholder-gray-400 dark:placeholder-gray-500focus:outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
                <h2 className="text-3xl">Todos</h2>
                <button 
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    onClick={openModal}
                >
                    Add Task
                </button>
            </div>

            {/* Tabs */}
            <div className="flex w-full max-w-xl mb-6 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                {progressTab.map((tab, index) => (
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
                {filteredTasks.length > 0 ?
                    <>
                        {filteredTasks.map((task, index) => (
                            <li key={index} className="flex items-center justify-between p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <input 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        className="form-checkbox" 
                                        onChange={(e) => handleUpdateTask(e, task.id, !task.completed, task.title)}
                                    />
                                    <span className={`text-gray-500 dark:text-gray-400 ${task.completed && "line-through"} break-words truncate`}>
                                        {task.title}
                                    </span>
                                </div>
                                <div className="flex">
                                    <button 
                                        onClick={(e) => handleDeleteTask(e, task.id, task.title)}
                                        className="px-2 py-1 text-red-500 hover:text-red-700"
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                    <button
                                        className="px-2 py-1 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        onClick={(e) => navigateToDetail(e, task.id)}
                                    >
                                        detail
                                    </button>
                                </div>
                            </li>
                        ))}
                    </>
                    :
                    (activeProgressTab === 'Active') ? (
                        <div>No active task ...</div>
                    ) : (activeProgressTab === 'Completed') ? (
                        <div>No task completed yet ...</div>
                    ) : (
                        <div>No task added ...</div>
                    )

                }
            </ul>
        </main>
    );
}
 
export default TodoSection;
import { useEffect, useState } from "react";
import { useTodoStore } from "../store/TodoStore";


interface Task {
  id: number
  title: string
  completed: boolean
}

const TodoSection = () => {

    const activeProgressTab = useTodoStore(state => state.activeProgressTab)
    const setActiveProgressTab = useTodoStore(state => state.setActiveProgressTab)
    const getAllTasks = useTodoStore(state => state.getAllTasks)
    const [tasks, setTasks] = useState<Task[]>([])
    const [ title, setTitle ] = useState("")
    const createTask = useTodoStore(state => state.createTask)
    const updateTask = useTodoStore(state => state.updateTask)

    const porgressTab: string[] = ['All Tasks', 'Active', 'Completed']

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

    useEffect(() => {
        console.log(tasks)
    }, [tasks])


    const validate_input = () => {
        if (!title) return 'add task title is required'
        return ''
    }

    // creates new task and re-fetch all tasks from db again
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const validatedError = validate_input();
        console.log(validatedError)

        if(validatedError === '') {
            await createTask(title);
            const data = await getAllTasks();
            setTasks(data);
            setTitle('');
        }
    };

    const handleUpdateTask = async (e: React.ChangeEvent<HTMLInputElement>, id: number, completed: boolean) => {
        e.preventDefault()
        await updateTask(id, completed);
        const data = await getAllTasks();
        setTasks(data);
    }


    // filter tasks
    const filteredTasks = tasks.filter(task => {
        if (activeProgressTab === 'Active') return !task.completed;
        if (activeProgressTab === 'Completed') return task.completed;
        return true;
    });


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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-100  placeholder-gray-400 dark:placeholder-gray-500focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateTask}
                >
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
                {filteredTasks.map((task, index) => (
                    <li key={index} className="flex items-center justify-between p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <input 
                                type="checkbox" 
                                checked={task.completed} 
                                className="form-checkbox" 
                                onChange={(e) => handleUpdateTask(e, task.id, !task.completed)}
                            />
                            <span className={`text-gray-500 dark:text-gray-400 ${task.completed && "line-through"} break-words truncate`}>
                                {task.title}
                            </span>
                        </div>
                        <button className="px-2 py-1 text-red-500 hover:text-red-700">✕</button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
 
export default TodoSection;
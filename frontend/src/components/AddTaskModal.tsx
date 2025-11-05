import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore } from "../store/TodoStore";
import { useToastStore } from "../store/ToastStore";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

const AddTaskModal = ({ open, onClose }: AddTaskModalProps) => {

    const getAllTasks = useTodoStore(state => state.getAllTasks)
    const createTask = useTodoStore(state => state.createTask)
    const setTasks = useTodoStore(state => state.setTasks)
    const showToast = useToastStore(state => state.showToast);
    const [ formData, setFormData ] = useState({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
    })

    useEffect(() => {
        // Prevent background scroll while modal is open
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



   const validate_input = () => {
        const title = formData.title?.trim() || '';
        const description = formData.description?.trim() || '';
        const priority = formData.priority?.trim().toLowerCase() || '';
        const dueDate = formData.due_date;

        if (!title) return 'Task title is required';
        if (title.length < 3) return 'Task title must be at least 3 characters long';
        if (title.length > 100) return 'Task title must be less than 100 characters long';

        if (!description) return 'Task description is required';
        if (description.length > 500) return 'Task description must be less than 500 characters long';

        if (priority && !['low', 'medium', 'high'].includes(priority)) return 'Invalid priority level';

        if (!dueDate) return 'Select due date';
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            if (isNaN(parsedDate.getTime())) return 'Invalid due date';
        }

        return '';
    };


    // handles task creation using enter key
    const handleTaskCreation = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCreateTask(e)
        }
    }

    // creates new task and re-fetch all tasks from db again
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const validatedError = validate_input();
        console.log(validatedError)

        if(validatedError === '') {
            const dueDateTimestamp = formData.due_date ? new Date(formData.due_date) : new Date();
            await createTask(formData.title, formData.description, formData.priority, dueDateTimestamp);
            const data = await getAllTasks();
            setTasks(data);
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                due_date: ''
            });
            onClose();
            showToast("Task created successfully", "success");
        }
    };

    useEffect(() => {
        console.log(formData)
        const test = formData.due_date ? new Date(formData.due_date).toISOString() : new Date
        console.log("due date:", typeof test, test)
    }, [formData])

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                className="fixed inset-0 z-50 pt-10 max-h-screen overflow-y-auto flex items-start justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-2xl p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Add New Task
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form Fields */}
                        <form className="space-y-4">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    id="title"
                                    onKeyDown={(e) => handleTaskCreation(e)}
                                    placeholder="Enter task title"
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    id="description"
                                    rows={3}
                                    placeholder="Enter task details..."
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Priority
                                </label>
                                <div className="flex space-x-4">
                                    {["Low", "Medium", "High"].map((level, i) => (
                                        <label
                                            key={i}
                                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={level.toLowerCase()}
                                                checked={formData.priority === level.toLowerCase()}
                                                onChange={handleChange}   
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={handleCreateTask}
                                >
                                    Save Task
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTaskModal;

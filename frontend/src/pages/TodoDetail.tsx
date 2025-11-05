import { RiArrowLeftLine, RiDeleteBin6Line, RiCheckLine } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTodoStore } from "../store/TodoStore";
import { useEffect, useState } from "react";
import { useToastStore } from "../store/ToastStore";

const TodoDetail = () => {

  const getATask = useTodoStore(state => state.getATask)
  const setTask = useTodoStore(state => state.setTask)
  const deleteTask = useTodoStore(state => state.deleteTask)
  const showToast = useToastStore(state => state.showToast)
  const updateTask = useTodoStore(state => state.updateTask)
  const task = useTodoStore(state => state.task)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      if (id) {
        const data = await getATask(Number(id))
        setTask(data)
      }
    }

    fetchTasks()
  }, [])

  useEffect(() => {
    console.log(task)
  }, [task])

  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  // handles each task delete
  const handleDeleteTask = async (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault()
    await deleteTask(Number(id))
    navigate('/')
    showToast(`${task.title} task deleted`, "error")
  }

  // handles update tasks, either completed or not completed
  const handleUpdateTask = async () => {
    await updateTask(Number(id), !task.completed);
    const data = await getATask(Number(id));
    setTask(data);
    const message = (task.completed ? `(${task.title}) task marked as completed` : `(${task.title}) task marked as not completed`)
    const type = task.completed ? "success" : "info"
    showToast(message, type);
  }

  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <RiArrowLeftLine className="text-lg" />
            <Link to='/'>Back</Link>
          </button>

          <div className="flex space-x-3">
            {/* <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400">
              <RiEdit2Line />
            </button> */}
            <button 
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400"
              onClick={handleDeleteTask}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        </div>

        {/* Title + Status */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 break-words">
            {task.title}
          </h1>

          <span 
            className={`px-3 py-1 text-sm font-medium rounded-full ${ task.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' }`}
          >
            {task.completed ? 'completed' : 'not completed'}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-14">
          <span 
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              task.priority ? priorityColors[task.priority as keyof typeof priorityColors] : priorityColors.default
            }`}
          >
            {task.priority} Priority
          </span>

          <span 
            className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}
          </span>
        </div>

        {/* Description */}
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Description
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            Create a clean, modern dashboard layout using React, Tailwind CSS, and Zustand.
            Include widgets for quick stats, recent activity, and tasks overview.
          </p>
        </section>

        {/* Actions */}
        <div className="flex justify-end mt-8 space-x-3">
          <button 
            className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleUpdateTask}
          >
            <RiCheckLine className="mr-2" />
            Mark as Completed
          </button>
        </div>
      </div>
    </main>
  );
};

export default TodoDetail;
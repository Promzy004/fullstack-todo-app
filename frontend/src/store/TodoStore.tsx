import { create } from "zustand";
import api from "../api";

interface Task {
  id: number
  title: string
  completed: boolean
  description: string | null
  due_date: string | null
  priority: string | null
}


interface TodoStoreType{
    task: Task,
    setTask: (tasks: any) => void,

    tasks: Task[],
    setTasks: (tasks: any[]) => void,

    darkMode: boolean
    setDarkMode: (value: boolean) => void
    showSidebar: boolean
    setShowSidebar: (value: boolean) => void

    activeProgressTab: string,
    setActiveProgressTab: (value: string) => void

    activeMenuTab: string,
    setActiveMenuTab: (tab: string) => void

    createTask: (title: string, description: string, priority: string, due_date: Date) => Promise<void>
    getAllTasks: () => Promise<any>
    updateTask: (id: number, completed: boolean) => Promise<void>
    deleteTask: (id: number) => Promise<void>
    getATask: (id: number) => Promise<void>
}

export const useTodoStore = create<TodoStoreType>((set) => ({
    task: {
        id: 0,
        title: '',
        completed: false,
        description: null,
        due_date: null,
        priority: null
    },
    setTask: (task) => set({ task: task }),
    tasks: [],
    setTasks: (tasks) => set({ tasks: tasks }),
    darkMode: true,
    setDarkMode: (value) => set({ darkMode: value }),
    showSidebar: false,
    activeProgressTab: 'All Tasks',
    activeMenuTab: 'Todos',
    setShowSidebar: (value) => set({showSidebar: value}),
    setActiveProgressTab: (value) => set({activeProgressTab: value}),
    setActiveMenuTab: (tab) => set({activeMenuTab: tab}),

    createTask: async (title, description, priority, due_date) => {
        await api.post("/api/create-task", {title, description, priority, due_date})
    },

    getAllTasks: async () => {
        try {
            const res = await api.get("/api/tasks")
            return res.data
        } catch (err) {
            console.log(err)
            return []
        }
    },

    updateTask: async (id, completed) => {
        await api.patch(`/api/update/${id}`, {completed})
    },

    deleteTask: async (id) => {
        await api.delete(`api/delete/${id}`)
    },

    getATask: async (id) => {
        try {
            const res = await api.get(`/api/task/${id}`)
            console.log(id)
            return res.data
        } catch (err) {
            console.log(err)
            return []
        }
    } 
}))
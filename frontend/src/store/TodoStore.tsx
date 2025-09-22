import { create } from "zustand";
import api from "../api";

interface TodoStoreType{
    darkMode: boolean
    setDarkMode: (value: boolean) => void
    showSidebar: boolean
    setShowSidebar: (value: boolean) => void

    activeProgressTab: string,
    setActiveProgressTab: (value: string) => void

    activeMenuTab: string,
    setActiveMenuTab: (tab: string) => void

    createTask: (title: string) => Promise<void>
    getAllTasks: () => Promise<any>
    updateTask: (id: number, completed: boolean) => Promise<void>
    deleteTask: (id: number) => Promise<void>
}

export const useTodoStore = create<TodoStoreType>((set) => ({
    darkMode: true,
    setDarkMode: (value) => set({ darkMode: value }),
    showSidebar: false,
    activeProgressTab: 'All Tasks',
    activeMenuTab: 'Todos',
    setShowSidebar: (value) => set({showSidebar: value}),
    setActiveProgressTab: (value) => set({activeProgressTab: value}),
    setActiveMenuTab: (tab) => set({activeMenuTab: tab}),

    createTask: async (title) => {
        await api.post("/api/create-task", {title})
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
    } 
}))
import { create } from "zustand";
import api from "../api";

interface TodoStoreType{
    showSidebar: boolean
    setShowSidebar: (value: boolean) => void

    activeProgressTab: string,
    setActiveProgressTab: (value: string) => void

    activeMenuTab: string,
    setActiveMenuTab: (tab: string) => void

    createTask: (title: string) => Promise<void>
    getAllTasks: () => Promise<any>
}

export const useTodoStore = create<TodoStoreType>((set) => ({
    showSidebar: false,
    activeProgressTab: 'All Tasks',
    activeMenuTab: 'Todos',
    setShowSidebar: (value) => set({showSidebar: value}),
    setActiveProgressTab: (value) => set({activeProgressTab: value}),
    setActiveMenuTab: (tab) => set({activeMenuTab: tab}),

    createTask: async (title) => {
        try{
            await api.post("/api/create-task", {title})
        } catch (err) {
            
        }
    },

    getAllTasks: async () => {
        try {
            const res = await api.get("/api/tasks")
            return res.data
        } catch (err) {
            console.log(err)
            return {}
        }
    }
}))
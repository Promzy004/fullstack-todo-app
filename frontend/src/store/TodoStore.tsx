import { create } from "zustand";

interface TodoStoreType{
    showSidebar: boolean
    setShowSidebar: (value: boolean) => void

    activeProgressTab: string,
    setActiveProgressTab: (value: string) => void

    activeMenuTab: string,
    setActiveMenuTab: (tab: string) => void
}

export const useTodoStore = create<TodoStoreType>((set) => ({
    showSidebar: false,
    activeProgressTab: 'All Tasks',
    activeMenuTab: 'Todos',
    setShowSidebar: (value) => set({showSidebar: value}),
    setActiveProgressTab: (value) => set({activeProgressTab: value}),
    setActiveMenuTab: (tab) => set({activeMenuTab: tab})
}))
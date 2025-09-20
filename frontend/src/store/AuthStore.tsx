import { create } from "zustand";
import api from "../api";
import { delay } from "../delay";

interface IAuthStore {
    user: any
    loading: boolean

    login: (email: string, password: string) => Promise<any>
    fetchUser: () => Promise<void>

    logout: () => Promise<any>
}

export const useAuthStore = create<IAuthStore>((set) => ({
    user: null,
    loading: false,

    login: async (email, password) => {
        set({ loading: true })
        await delay(5000)
        try {
            await api.post("/api/auth/login", {
                email,
                password
            })

            const fetchUser = useAuthStore.getState().fetchUser;
            await fetchUser();

            return { success: true };
        } catch (err: any) {
            set({ loading: false })
            return { success: false, errors: err.response?.data || {errors: err.message}  };
        }
    },

    fetchUser: async () => {
        try{
            const res = await api.get("/api/user");
            console.log(res)
            set({ user: res.data.user, loading: false })
        } catch (error) {
            set({ user: null, loading: false })
        }
    },

    logout: async () => {
        set({ loading: true })
        await delay(5000)
        try{
            await api.post("/api/auth/logout")
        } catch {
            
        } finally {
            set({ loading: false })
            set({ user: null })
        }
    }
}))
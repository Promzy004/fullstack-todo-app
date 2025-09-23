import { create } from "zustand";
import api from "../api";
import { delay } from "../delay";

// user type
interface IUser {
    firstname: string
    lastname: string
    email: string
    verified_at: string
}

// store type
interface IAuthStore {
    user: IUser | null
    loading: boolean
    verifyModal: boolean

    login: (email: string, password: string) => Promise<any>
    fetchUser: () => Promise<void>
    setVerifyModal: (value: boolean) => void
    pendingEmail: string

    logout: () => Promise<any>

    register: (email: string,firstname: string, lastname: string, password: string) => Promise<any>
    handleVerify: (code: string, email: string) => Promise<any>;
    updateUserInfo: (field: keyof IUser, value: string) => Promise<void>
    resendCode: (email: string) => Promise<void>
}

// Zustand store
export const useAuthStore = create<IAuthStore>((set) => ({
    user: null,
    loading: false,
    verifyModal: false,
    pendingEmail: "",

    setVerifyModal: (value) => set({ verifyModal: value }),

    // register
    register: async (email, firstname, lastname, password) => {
        set({ loading: true })
        await delay(5000)
        try {
            await api.post("/api/auth/register", {
                email,
                firstname,
                lastname,
                password
            })

            set({ loading: false , verifyModal: true , pendingEmail: email})
            return { success: true };
        } catch (err: any) {
            set({ loading: false })
            return { success: false, errors: err.response?.data || {errors: err.message}  };
        }
    },

    // verify
    handleVerify: async (code, email) => {
        set({ loading: true })
        await delay(3000)
        try {
            await api.post("/api/verify", { email, code });
            set({ loading: false });
            return { success: true };
        } catch (err: any) {
            set({ loading: false })
            return { success: false, errors: err.response?.data || {errors: err.message}  };
        }
    },

    //login
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

    //fetch user
    fetchUser: async () => {
        try{
            const res = await api.get("/api/user");
            console.log(res)
            set({ user: res.data.user, loading: false })
        } catch (error) {
            set({ user: null, loading: false })
        }
    },

    // logout 
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
    },

    // update user info
    updateUserInfo: async (field , value) => {
        try{
            await api.patch("api/update-info", {[field]: value});

            // update store user object
            set((state) => ({
                user: {
                    ...(state.user as IUser),
                    [field]: value,
                },
            }));
        } catch (err) {
            throw err;
        }
    },

    //verify email in app
    resendCode: async (email) => {
        await api.patch("/api/auth/resend-code", {email})
        set({ pendingEmail: email })
        set((state) => ({
            user: {
                ...(state.user as IUser),
                [email]: email,
            },
        }));
    }
}))
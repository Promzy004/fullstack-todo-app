import { create } from "zustand";
import api from "../api";
import { delay } from "../delay";

// user type
interface IUser {
    firstname: string
    lastname: string
    email: string
    verified_at: string
    password?: string
}

// store type
interface IAuthStore {
    user: IUser | null
    loadingVerify: boolean,
    logoutLoading: boolean,
    loading: boolean
    verifyModal: boolean
    authChecked: boolean;

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
    loadingVerify: false,
    logoutLoading: false,
    loading: false,
    verifyModal: false,
    pendingEmail: "",
    authChecked: false,

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
        set({ loadingVerify: true })
        await delay(3000)
        try {
            await api.post("/api/verify", { email, code });
            set({ loadingVerify: false });

            // const fetchUser = useAuthStore.getState().fetchUser;
            // await fetchUser();

            return { success: true };
        } catch (err: any) {
            set({ loadingVerify: false })
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
        set({ loading: true })
        try{
            const res = await api.get("/api/user");
            console.log(res)
            set({ user: res.data.user, loading: false, authChecked: true });
        } catch (error) {
            set({ user: null, loading: false, authChecked: true });
        }
    },

    // logout 
    logout: async () => {
        set({ logoutLoading: true })
        await delay(5000)
        try{
            await api.post("/api/auth/logout")
        } finally {
            set({ logoutLoading: false })
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
            if (field == 'email') {
                set({  pendingEmail: value })
            }
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
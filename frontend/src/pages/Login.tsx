import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { BeatLoader } from "react-spinners";


interface IFormData {
  email: string
  password: string
}

interface IFormErrors {
    email?: string,
    password?: string
}

const Login = () => {

    const [ formData, setFormData ] = useState<IFormData>({
        email: '',
        password: '',
    })
    const [ formErrors, setFormErrors ] = useState<IFormErrors>({})
    const login = useAuthStore(state => state.login)
    const loading = useAuthStore(state => state.loading)


    const validate_form = () => {
        const errors: IFormErrors = {}

        //validate email
        if(!formData.email.trim()) {
            errors.email = 'Email is required'
        } 

        //validate password
        if(!formData.password.trim()){
            errors.password = 'Password is required'
        } 

        return errors
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const validation_errors = validate_form()
        setFormErrors(validation_errors)

        if (Object.keys(validation_errors).length === 0) {
            const resData = await login(formData.email, formData.password)
            if (!resData.success) {
                setFormErrors(resData?.errors?.errors)
            }
        }
    }

    
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md p-6 space-y-6 rounded-lg shadow-lg sm:p-8 bg-light dark:bg-dark">
                {/* Title */}
                <h1 className="text-2xl font-extrabold text-center sm:text-3xl">
                    Sign In
                </h1>
                <p className="text-center font-[450]">
                    Sign into your account to continue.
                </p>

                {/* Form */}
                <form className="space-y-4">
                    {/* Email */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="block mb-1 text-sm"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email:e.target.value})}
                            className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400 dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Enter your email"
                        />
                        {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="block mb-1 text-sm"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password:e.target.value})}
                            className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400 dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.password ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Enter your password"
                        />
                        {formErrors.password && <span className="text-[10px] text-red-500">{formErrors.password}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSubmit}
                    >
                        {loading ? 
                            <BeatLoader color="#fff" loading={loading} size={10} />
                            :
                            <span>Sign In</span>  
                        }
                    </button>
                </form>

                {/* Footer link */}
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
 
export default Login;
import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { BeatLoader } from "react-spinners";
import VerificationModal from "../components/VerificationModal";

interface IFormData {
    firstname: string
    lastname: string
    email: string
    password: string
    cpassword: string
}

interface IFormErrors {
    firstname?: string
    lastname?: string
    email?: string
    password?: string
    cpassword?: string
}

const Register = () => {

    const [ formData, setFormData ] = useState<IFormData>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        cpassword: ''
    })
    const [ formErrors, setFormErrors ] = useState<IFormErrors>({})
    const register = useAuthStore(state => state.register)
    const loading = useAuthStore(state => state.loading)
    const verifyModal = useAuthStore(state => state.verifyModal)
    const setVerifyModal = useAuthStore(state => state.setVerifyModal)



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    const validate_form = () => {
        const errors: IFormErrors = {}

        //email validation
        const email_regex = /^([a-z]+(\.?)(\w+)?@[a-z]+(-?)(\w+)?(\.[a-z]+)+)$/i
        const email_test = email_regex.test(formData.email)

        if(!formData.email.trim()) {
            errors.email = 'Email is required'
        } else if (!email_test) {
            errors.email = 'Invalid Email Address'
        }

        //firstname validation
        if(!formData.firstname.trim()) {
            errors.firstname = 'Firstname is required'
        }

        //lastname validation
        if(!formData.lastname.trim()) {
            errors.lastname = 'Lastname is required'
        }

        //password validation
        const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@,%$#:])[a-zA-Z0-9@,%$#:]{8,}$/i
        const password_test = password_regex.test(formData.password)

        if(!formData.password.trim()){
            errors.password = 'Password is required'
        } else if (!password_test) {
            errors.password = 'Password must contain capital letter, small letter, number and special chars'
        } else if (formData.password !== formData.cpassword) {
            errors.password = 'password and confirm password does not match'
            errors.cpassword = 'password and confirm password does not match'
        }

        //confirm password validation
        if(!formData.cpassword.trim()){
            errors.cpassword = 'Confirm password is required'
        }


        //returns all validate error, or empty array if none is found 
        return errors;
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const validation_errors = validate_form()
        setFormErrors(validation_errors)

        if (Object.keys(validation_errors).length === 0) {
            const resData = await register(formData.email, formData.firstname, formData.lastname, formData.password)
            if (resData.success) {
                setFormData({
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    cpassword: ''
                })
            } else {
                setFormErrors(resData?.errors?.errors)
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md p-6 space-y-6 rounded-lg shadow-lg sm:p-8 bg-light dark:bg-dark">
                {/* Title */}
                <h1 className="text-2xl font-extrabold text-center sm:text-3xl">
                    Sign Up
                </h1>
                <p className="text-center font-[450]">
                    Create your account to get started.
                </p>

                {/* Form */}
                <form className="space-y-4">
                    {/* Firstname */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="firstname"
                            className="block mb-1 text-sm"
                        >
                            Firstname
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400  dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.firstname ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Enter your name"
                        />
                        {formErrors.firstname && <span className="text-[10px] text-red-500">{formErrors.firstname}</span>}
                    </div>

                    {/* Lastname */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="lastname"
                            className="block mb-1 text-sm"
                        >
                            Lastname
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400  dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.lastname ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Enter your name"
                        />
                        {formErrors.lastname && <span className="text-[10px] text-red-500">{formErrors.lastname}</span>}
                    </div>

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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400  dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? "border-red-400" : "border-gray-300"}`}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400  dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.password ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Enter your password"
                        />
                        {formErrors.password && <span className="text-[10px] text-red-500">{formErrors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="cpassword"
                            className="block mb-1 text-sm"
                        >
                            Confirm Password
                        </label>
                        <input
                        type="password"
                        id="cpassword"
                        name="cpassword"
                        value={formData.cpassword}
                            onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md bg-white placeholder-gray-400  dark:bg-gray-700 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.cpassword ? "border-red-400" : "border-gray-300"}`}
                        placeholder="Confirm your password"
                        />
                        {formErrors.cpassword && <span className="text-[10px] text-red-500">{formErrors.cpassword}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? 
                            <BeatLoader color="#fff" loading={loading} size={10} />
                            :
                            <span>Create Account</span>  
                        }
                    </button>
                </form>

                {/* Footer link */}
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Login
                    </a>
                </p>
            </div>
            <VerificationModal
                isOpen={verifyModal}
                onClose={() => setVerifyModal(false)}
                userEmail={formData.email}
            />
        </div>
    );
}
 
export default Register;
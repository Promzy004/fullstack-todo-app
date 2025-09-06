const Login = () => {
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
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-1 text-sm"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded-md bg-white
                                        placeholder-gray-400 border-gray-300 
                                        dark:bg-gray-700 dark:placeholder-gray-500 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-1 text-sm"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border rounded-md bg-white
                                        placeholder-gray-400 border-gray-300 
                                        dark:bg-gray-700 dark:placeholder-gray-500 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign In
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
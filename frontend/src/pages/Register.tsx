const Register = () => {
    return (
        // <div className="mx-auto mt-20 px-4 py-3 w-max flex flex-col gap-7 justify-center items-center bg-light dark:bg-dark">
        //     <h2>Sign Up</h2>
        //     <form action="" method="post">
        //         <label className="flex flex-col gap-1">
        //             <span>Name</span>
        //             <input 
        //                 type="text"
        //                 aria-label="Input your name" 
        //                 className="border bg-white dark:bg-gray-400 focus:outline-none"
        //             />
        //         </label>
        //     </form>
        // </div>
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
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-1 text-sm"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border rounded-md bg-white
                                        placeholder-gray-400 border-gray-300 
                                        dark:bg-gray-700 dark:placeholder-gray-500 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                        />
                    </div>

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

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block mb-1 text-sm"
                        >
                            Confirm Password
                        </label>
                        <input
                        type="password"
                        id="confirm-password"
                        className="w-full px-3 py-2 border rounded-md bg-white
                                    placeholder-gray-400 border-gray-300 
                                    dark:bg-gray-700 dark:placeholder-gray-500 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create Account
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
        </div>
    );
}
 
export default Register;
import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const handleVerify = useAuthStore(state => state.handleVerify)
  const loading = useAuthStore(state => state.loading)
  const pendingEmail = useAuthStore(state => state.pendingEmail)
  const [ codeError, setCodeError ] = useState("")
  const [ isVerified, setIsVerified ] = useState(false)

  if (!isOpen) return null;

    const validate_input = () => {
        const regex = /[0-9]{6}/

        if (!code) 'verification code is required'
        if (!regex.test(code)) 'Code must be 6 digits only'
        return '';
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedError = validate_input();
    setCodeError(validatedError)

    if(validatedError === '') {
        const res = await handleVerify(code, pendingEmail)
        if(res.success) {
            setCode('')
            setIsVerified(true)
        } else {
            setCodeError(res?.errors?.message)
        }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container */}
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-light dark:bg-dark">
        {!isVerified ? 
            <>
                {/* Title */}
                <h2 className="mb-2 text-xl font-bold text-center">Verification</h2>
                <p className="mb-6 text-sm text-center text-gray-600 dark:text-gray-400">
                Please enter the verification code sent to {pendingEmail}.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <input
                            type="text"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className={`w-full px-3 py-2 border rounded-md text-center tracking-[0.5em] text-lg font-mono bg-white dark:bg-gray-700 dark:border-gray-600focus:outline-none focus:ring-2 focus:ring-blue-500 ${codeError ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {codeError && <span className="text-[10px] text-red-500">{codeError}</span>}
                    </div>

                {/* Buttons */}
                <div className="flex justify-between gap-3">
                    <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="w-1/2 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? 
                            <BeatLoader color="#fff" loading={loading} size={10} />
                            :
                            <span>Verify</span>  
                        }
                    </button>
                </div>
                </form>
            </>
            :
            <>
                {/* Success Message */}
                <h2 className="mb-4 text-xl font-bold text-center text-green-600">
                    ✅ Email Verified Successfully
                </h2>
                <p className="mb-6 text-sm text-center text-gray-600 dark:text-gray-400">
                    You can now login to your account.
                </p>

                <div className="flex justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                    Cancel
                </button>
                <Link
                    to="/login"
                    className="w-1/2 py-2 text-center font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                    Go to Login
                </Link>
                </div>
            </>
        }
      </div>
    </div>
  );
};

export default VerificationModal;

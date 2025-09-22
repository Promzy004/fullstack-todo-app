import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "../store/ToastStore";

const Toast = () => {
  const { isOpen, message, type, hideToast } = useToastStore();

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-5 right-5 px-4 py-2 text-white rounded-lg shadow-lg ${bgColor}`}
          onClick={hideToast}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

import { useState } from "react";
import { useTodoStore } from "../store/TodoStore";
import { useAuthStore } from "../store/AuthStore";
import { useToastStore } from "../store/ToastStore";
import VerificationModal from "../components/VerificationModal";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  verified_at: string
}

const Settings = () => {

  const [editingField, setEditingField] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const darkMode = useTodoStore(state => state.darkMode)
  const setDarkMode = useTodoStore(state => state.setDarkMode)
  const user = useAuthStore(state => state.user)
  const updateUserInfo = useAuthStore(state => state.updateUserInfo)
  const showToast = useToastStore(state => state.showToast)
  const [ verifyModal, setVerifyModal ] = useState(false)
  const resendCode = useAuthStore(state => state.resendCode)

  // random avatar from dicebear
  const avatarUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${user.firstname}${user.lastname}`;

  const handleEdit = (field: keyof User) => {
    setEditingField(field);
    setTempValue(user?.[field] || '')
  };

  const handleSave = async () => {
    if (!editingField) return;

    const oldValue = user?.[editingField];
    const newValue = tempValue.trim();

    if (oldValue === newValue) {
      setEditingField(null);
      return;
    }

    try {
      // call store action (which also calls backend + updates state)
      await updateUserInfo(editingField, newValue);
      setEditingField(null);
      showToast(`${editingField} updated`, "success")
      if (editingField === "email") {
        setVerifyModal(true)
      }
    } catch (err) {
      console.error("Failed to update user info:", err);
      showToast(`Failed to update ${editingField}`, "error")
      setEditingField(null);
    }
  };

  const handleVerifyEmail = async (e: React.MouseEvent<HTMLButtonElement>, email: string) => {
    e.preventDefault()
    await resendCode(email)
    setVerifyModal(true)
  }

  const handlePasswordSave = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Updating password to:", newPassword);
      setShowPasswordForm(false);
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (err) {
      console.error("Failed to update password:", err);
      setError("Failed to update password");
    }
  };

  return (
    <main className="flex flex-col items-center p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile information
        </p>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-xl p-6 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mb-2 border border-gray-300 dark:border-gray-600"
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Random avatar
          </p>
        </div>

        {/* Info fields */}
        <div className="space-y-4">
          {/* Firstname */}
          <div className="flex items-center justify-between p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
            <span className="text-gray-700 dark:text-gray-300">Firstname</span>
            {editingField === "firstname" ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {user?.firstname}
                </span>
                <button
                  onClick={() => handleEdit("firstname")}
                  className="px-2 py-1 text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Lastname */}
          <div className="flex items-center justify-between p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
            <span className="text-gray-700 dark:text-gray-300">Lastname</span>
            {editingField === "lastname" ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {user?.lastname}
                </span>
                <button
                  onClick={() => handleEdit("lastname")}
                  className="px-2 py-1 text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <div className={`flex items-center justify-between p-3 rounded-md border bg-gray-50 dark:bg-gray-900 ${!user?.verified_at ? "border-yellow-400 dark:border-yellow-200" : "border-gray-300 dark:border-gray-600"}`}>
              <span className="text-gray-700 dark:text-gray-300">Email</span>
              {editingField === "email" ? (
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={handleSave}
                    className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {user?.email}
                  </span>
                  <button
                    onClick={() => handleEdit("email")}
                    className="px-2 py-1 text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            {!user?.verified_at && (
              <button 
                onClick={(e) => handleVerifyEmail(e, user?.email || '')}
                className="text-xs text-yellow-400 dark:text-yellow-200 self-end hover:underline"
              >
                verify email
              </button>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
          {showPasswordForm ? (
            <div className="space-y-4">
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handlePasswordSave}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Change Password
            </button>
          )}
        </div>

        {/* Theme Toggle Section */}
        <div className="pt-4 border-t border-gray-300 dark:border-gray-600 flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Theme</span>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
      <VerificationModal 
        isOpen={verifyModal}
        onClose={() => setVerifyModal(false)}
        userEmail={user?.email || ''}
      />
    </main>
  );
};

export default Settings;

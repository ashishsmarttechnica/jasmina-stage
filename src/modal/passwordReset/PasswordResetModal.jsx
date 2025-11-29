"use client";
import PasswordField from "@/components/form/PasswordField";
import { useUserResetPass } from "@/hooks/auth/userResetAndForgotPass";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";

const PasswordResetModal = ({ isOpen, onClose, userData }) => {
  const t = useTranslations("auth");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: resetPassword, isPending } = useUserResetPass();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword?.trim()) {
      newErrors.currentPassword = t("PasswordError");
    }

    if (!formData.newPassword?.trim()) {
      newErrors.newPassword = t("PasswordError");
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t("passwordLengthError");
    }

    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = t("PasswordError");
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    resetPassword(
      {
        id: userData?._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black/[40%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="no-scrollbar relative !max-h-[90vh] !w-[95%] overflow-hidden overflow-y-auto rounded-[10px] bg-white shadow-xl sm:!w-[90%] md:!w-[545px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-[#0F8200] to-[#4CAF50]"></div>
            <div className="h-full overflow-y-auto !px-6 py-6 sm:px-4 md:px-6">
              <div className="mb-4 flex items-start gap-3">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  <IoClose className="text-[28px] text-black" />
                </button>

                <div className="w-full">
                  <div className="mx-auto mt-4 mb-6 flex max-w-[320px] flex-col items-center text-center">
                    <div className="mb-3 rounded-full bg-[#0F8200]/10 p-3">
                      <RiLockPasswordLine className="text-[28px] text-[#0F8200]" />
                    </div>
                    <span className="mb-1 text-[20px] font-semibold text-black">
                      {t("resetPassword")}
                    </span>
                    <p className="text-[15px] font-normal text-[#888DA8]">
                      {t("resetPasswordDescription")}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Hidden field to prevent autofill */}
                    <input type="text" name="hidden" style={{ display: "none" }} />
                    <input type="password" name="hidden-password" style={{ display: "none" }} />

                    {error && (
                      <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <PasswordField
                        label={t("CurrentPassword")}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        show={showCurrent}
                        toggle={() => setShowCurrent(!showCurrent)}
                        error={errors.currentPassword}
                        autocomplete="off"
                      />

                      <PasswordField
                        label={t("NewPassword")}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        show={showNew}
                        toggle={() => setShowNew(!showNew)}
                        error={errors.newPassword}
                        autocomplete="off"
                      />

                      <PasswordField
                        label={t("ConfirmPassword")}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        show={showConfirm}
                        toggle={() => setShowConfirm(!showConfirm)}
                        error={errors.confirmPassword}
                        autocomplete="off"
                      />
                    </div>

                    <div className="flex w-full items-center justify-center">
                      <button type="submit" className="btn-fill" disabled={isPending}>
                        {isPending ? `${t("Resetting")}...` : t("ResetPassword")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordResetModal;

"use client";
import InputField from "@/common/InputField";
import PasswordField from "@/components/form/PasswordField";
import { useState } from "react";
const NewPasswordStep = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isPending,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <form className="mt-7.5" onSubmit={onSubmit}>
      <PasswordField
        label="New Password"
        name="newPassword"
        value={newPassword}
        onChange={onNewPasswordChange}
        autoComplete="new-password"
        show={showPassword}
        toggle={() => setShowPassword(!showPassword)}
      />
      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        autoComplete="new-password"
        show={showConfirmPassword}
        toggle={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      <button type="submit" className="btn-fill mt-4" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit New Password"}
      </button>
    </form>
  );
};

export default NewPasswordStep;

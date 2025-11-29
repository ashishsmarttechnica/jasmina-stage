"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Modal } from "rsuite";

const AccountTypeModal = ({ isOpen, onClose, onSelectAccountType, isLoading }) => {
  const t = useTranslations("auth");
  const [selectedType, setSelectedType] = useState("User");

  const handleConfirm = () => {
    onSelectAccountType(selectedType);
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="xs" className="account-type-modal">
      <Modal.Header>
        <Modal.Title className="text-custBlack text-xl font-medium">
          {t("SelectAccountType")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-grayBlueText mb-4 text-sm">{t("PleaseSelectAccountType")}</p>
        <div className="flex flex-col gap-4">
          <div
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all ${
              selectedType === "User"
                ? "border-primary bg-secondary/20"
                : "border-gray hover:border-primary/30"
            }`}
            onClick={() => setSelectedType("User")}
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              <input
                type="radio"
                id="user-type"
                name="accountType"
                value="User"
                checked={selectedType === "User"}
                onChange={() => setSelectedType("User")}
                className="absolute opacity-0"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  selectedType === "User" ? "border-primary" : "border-gray-400"
                }`}
              >
                {selectedType === "User" && <div className="bg-primary h-3 w-3 rounded-full"></div>}
              </div>
            </div>
            <label htmlFor="user-type" className="cursor-pointer text-base font-medium">
              {t("User")}
            </label>
          </div>

          <div
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all ${
              selectedType === "Company"
                ? "border-primary bg-secondary/20"
                : "border-gray hover:border-primary/30"
            }`}
            onClick={() => setSelectedType("Company")}
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              <input
                type="radio"
                id="company-type"
                name="accountType"
                value="Company"
                checked={selectedType === "Company"}
                onChange={() => setSelectedType("Company")}
                className="absolute opacity-0"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  selectedType === "Company" ? "border-primary" : "border-gray-400"
                }`}
              >
                {selectedType === "Company" && (
                  <div className="bg-primary h-3 w-3 rounded-full"></div>
                )}
              </div>
            </div>
            <label htmlFor="company-type" className="cursor-pointer text-base font-medium">
              {t("Company")}
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onClose}
          appearance="subtle"
          className="hover:text-primary text-grayBlueText px-4 py-2"
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          appearance="primary"
          loading={isLoading}
          className="bg-primary hover:bg-primary/90 px-4 py-2 text-white"
        >
          {t("Continue")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountTypeModal;

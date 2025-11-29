"use client";

import { ContactvalidateForm } from "@/hooks/validation/contact/ContactvalidateForm";
import useContactStore from "@/store/contact.store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

const ContactForm = ({ onSubmit }) => {
    const { createContact, loading } = useContactStore();
    const t = useTranslations("contact");



    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        const newErrors = ContactvalidateForm({ ...formData, [name]: value }, t);
        setErrors((prev) => ({
            ...prev,
            [name]: newErrors[name] || "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = ContactvalidateForm(formData, t);

        if (Object.keys(validationErrors).length === 0) {
            try {
                await createContact(formData);

                toast.success(t("successMessage"));

                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            } catch (error) {
                // Error is already handled in the store
                toast.error(t("errorMessage"));
            }
        } else {
            setErrors(validationErrors);
        }
    };


    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-gray-700 font-medium mb-1">{t("name")}</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    placeholder={t("namePlaceholder")}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">{t("email")}</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    placeholder={t("emailPlaceholder")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">{t("subject")}</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${errors.subject ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    placeholder={t("subjectPlaceholder")}
                />
                {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">{t("message")}</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${errors.message ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    rows="5"
                    placeholder={t("messagePlaceholder")}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>
            <div className="text-center mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? t("sending") : t("submitButton")}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;

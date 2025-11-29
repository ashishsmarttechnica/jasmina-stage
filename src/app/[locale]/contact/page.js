"use client";

import ContactForm from "@/components/Contact/ContactForm";
import Header from "@/components/header/Header";
import UserHeader from "@/components/header/UserHeader";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Contact = () => {
    const t = useTranslations("contact");
    const [isLoggedIn] = useState(() => Boolean(Cookies.get("token")));

    const handleSubmit = (data) => {
        // This function is called after successful form submission
        // You can add additional logic here like:
        // - Redirecting to a thank you page
        // - Sending analytics data
        // - Updating UI state
        // console.log("Contact form submitted successfully:", data);

        // Example: You could redirect to a thank you page
        // router.push('/contact/thank-you');

        // Example: You could track the submission
        // analytics.track('contact_form_submitted', data);
    };

    return (
        <>
            {isLoggedIn ? <UserHeader /> : <Header isLogin={false} />}
            <main className="relative">
                <div className="py-12 px-2">
                    <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-300 rounded-lg p-3 pb-8 sm:p-8 ">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-4 mt-4 sm:mt-0">
                            {t("title")}
                        </h2>
                        <p className="text-center text-gray-600 mb-10 text-sm">
                            {t("subtitle")}
                        </p>
                        <ContactForm handleSubmit={handleSubmit} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Contact;

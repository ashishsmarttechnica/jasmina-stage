export const ContactvalidateForm = (formData, t) => {
    const errors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === "") {
        errors.name = t("nameRequired");
    } else if (formData.name.trim().length < 2) {
        errors.name = t("nameLength");
    }

    // Email validation
    if (!formData.email || formData.email.trim() === "") {
        errors.email = t("emailRequired");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = t("emailInvalid");
        }
    }

    // Subject validation
    if (!formData.subject || formData.subject.trim() === "") {
        errors.subject = t("subjectRequired");
    } else if (formData.subject.trim().length < 5) {
        errors.subject = t("subjectLength");
    }

    // Message validation
    if (!formData.message || formData.message.trim() === "") {
        errors.message = t("messageRequired");
    } else if (formData.message.trim().length < 10) {
        errors.message = t("messageLength");
    }

    return errors;

};

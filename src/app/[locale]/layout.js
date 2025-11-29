import Footer from "@/components/footer/Footer";
import MobileBottomNav from "@/components/header/MobileBottomNav";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { routing } from "@/i18n/routing";
import AppInit from "@/lib/AppInit";
import QueryProvider from "@/providers/QueryProvider";
import "@/styles/globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Ubuntu_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Add CSS for styling the toast
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import BlockedUserModal from "../../modal/BlockedUserModal";
import CompanyUnderReviewModal from "../../modal/CompanyUnderReviewModal";
import UserBlockedModal from "../../modal/UserBlockedModal";
import CookieConsent from "@/components/CookieConsent";

const ubuntu = Ubuntu_Sans({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  const rtlLocales = ["ar", "he", "fa", "ur"];
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir}>
      
      <body className={`${ubuntu.variable} antialiased`}>
        <CustomProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <NotificationProvider>
                <AppInit />
                <CookieConsent />
                <BlockedUserModal />
                <CompanyUnderReviewModal />
                <UserBlockedModal />
                {/* Spacer for mobile bottom nav so content isn't hidden */}
                <div className="pb-14 md:pb-0">
                  {children}
                </div>
                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
                <Footer />
              </NotificationProvider>
            </NextIntlClientProvider>
          </QueryProvider>
        </CustomProvider>
        <ToastContainer
          position="bottom-left"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={rtlLocales.includes(locale)}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={true}
          theme="light"
        />
      </body>
    </html>
  );
}

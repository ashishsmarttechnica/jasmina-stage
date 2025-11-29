"use client";

import { getFooterLink, getPages } from "@/api/pages.api";
import footerLogo from "@/assets/footer/footerLogo.png";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("footer");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { data: pagesResponse, isLoading: isLoadingPages } = useQuery({
    queryKey: ["pages", "footer", locale],
    queryFn: () => getPages(locale),
  });
  const { data: footerLinkResponse, isLoading: isLoadingFooterLink } = useQuery({
    queryKey: ["footerLink", locale],
    queryFn: () => getFooterLink(locale),
  });
  // console.log(footerLinkResponse?.data?.socialLinks, "footerLinkResponse?.data?.data?.socialLinks");


  // console.log(footerLinkResponse, "footerLinkResponse-------");


  //

  const pages = Array.isArray(pagesResponse?.data)
    ? pagesResponse.data
    : [];
  
  // Filter pages with "howitworks" in path for Explorer section
  const howItWorksPages = pages.filter((page) => 
    page?.path?.toLowerCase().includes("howitworks")
  );
  
  // Filter other pages (excluding howitworks) for SupportHelp section
  const otherPages = pages.filter((page) => 
    !page?.path?.toLowerCase().includes("howitworks")
  );
  
  const isRTL = locale === "ar";

  const handleNavigation = (path) => {
    router.push(path);
  };

  // No useEffect; fetching handled by React Query

  return (
    <footer>
      <div className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="md:flex md:items-center md:justify-center sm:flex-row flex-col  mb-10 pl-[10px] sm:pl-0">
            <div className="space-y-5 xl:me-[240px] space-x-3">
              <Image
                src={footerLogo}
                alt="footerLogo"
                width={225}
                height={94}
                className="w-auto h-auto"
              />
              <p className="text-grayBlueText text-base max-w-xs">
                {t("title")}
              </p>
            </div>
            <div className="grid 2xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 lg:gap-40 gap-10 mt-10 md:mt-0">
              <div>
                <div>
                  <h3 className="text-xl font-medium mb-2.5">
                    {t("Explorer")}
                  </h3>
                  <ul className="text-grayBlueText text-base">
                    {howItWorksPages.length > 0 ? (
                      howItWorksPages.map((val) => (
                        <li className="pb-1.5" key={val?._id ?? val?.path}>
                          <Link
                            href={`/pagedetail/${val?.path}`}
                            aria-current={
                              pathname?.includes(`/pagedetail/${val?.path}`)
                                ? "page"
                                : undefined
                            }
                            className={`cursor-pointer transition-colors duration-200 hover:text-primary ${pathname?.includes(`/pagedetail/${val?.path}`)
                              ? "text-primary font-medium"
                              : "text-inherit"
                              }`}
                          >
                            {val?.page_title || val?.information_name || val?.path}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        {/* <li className="pb-1.5">{t("explorerMenu.connection")}</li>
                        <li className="pb-1.5">{t("explorerMenu.FindJobs")}</li>
                        <li className="pb-1.5">{t("explorerMenu.PostJobJob")}</li>
                        <li className="pb-1.5">{t("explorerMenu.Chat")}</li>
                        <li className="pb-1.5">{t("explorerMenu.Notification")}</li>
                        <li className="">{t("explorerMenu.ShareYourExpertise")}</li> */}
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div>
                <div>
                  <h3 className="text-xl font-medium mb-2.5">
                    {t("SupportHelp")}
                  </h3>
                  <ul className="text-grayBlueText text-base">
                    {/* <li className="pb-1.5">
                      {t("SupportHelpMenu.FAQ")}
                    </li> */}
                    <li
                      className={`pb-1.5 cursor-pointer hover:text-primary transition-colors duration-200 ${pathname === "/contact" ? "text-primary font-medium" : ""}`}
                      onClick={() => handleNavigation("/contact")}
                    >
                      {t("SupportHelpMenu.ContactUs")}
                    </li>
                    {/* <li
                      className="pb-1.5 cursor-pointer hover:text-primary transition-colors duration-200"
                      onClick={() => handleNavigation("/privacy-policy")}
                    >
                      {t("SupportHelpMenu.PrivacyPolicy")}
                    </li>
                    <li
                      className="cursor-pointer hover:text-primary transition-colors duration-200"
                      onClick={() => handleNavigation("/terms-conditions")}
                    >
                      {t("SupportHelpMenu.TermsService")}
                    </li> */}
                    {otherPages.map((val) => (
                      <li className="pb-1.5" key={val?._id ?? val?.path}>
                        <Link
                          href={`/pagedetail/${val?.path}`}
                          aria-current={
                            pathname?.includes(`/pagedetail/${val?.path}`)
                              ? "page"
                              : undefined
                          }
                          className={`cursor-pointer transition-colors duration-200 hover:text-primary ${pathname?.includes(`/pagedetail/${val?.path}`)
                            ? "text-primary font-medium"
                            : "text-inherit"
                            }`}
                        >
                          {val?.page_title || val?.information_name || val?.path}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className="border border-b my-8 w-full border-footerBorder"></p>
          <div className="flex  justify-between sm:flex-row flex-col pl-[10px] sm:pl-0">
            <div>
              <div>
                <ul className="text-grayBlueText sm:flex-row flex-col flex items-start justify-start sm:gap-6 text-base">
                  {/* <li>{t("socialMenu.LinkedIn")}</li>
                  <li>{t("socialMenu.twitter")}</li>
                  <li>{t("socialMenu.Facebook")}</li>
                  <li>{t("socialMenu.Instagram")}</li> */}
                  {footerLinkResponse?.data?.socialLinks &&
                    Object.entries(footerLinkResponse.data.socialLinks).map(([name, link], index) => {
                      // if (name.toLowerCase() === "twitter") return null;
                      // Check if both name and link exist and are valid
                      const hasValidName = name && name.trim() !== "";
                      const hasValidLink = link && link.trim() !== "";
                      const shouldBeClickable = hasValidName && hasValidLink;
                      const displayName =
                        name.toLowerCase() === "twitter" ? "X" : name.charAt(0).toUpperCase() + name.slice(1);
                      return (
                        <li key={index}>
                          {shouldBeClickable ? (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors duration-200 cursor-pointer"
                            >
                              {displayName}
                            </a>
                          ) : (
                            <span className="text-gray-400 cursor-not-allowed">
                              {hasValidName ? displayName : "Social Link"}
                            </span>
                          )}
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </div>
            <div className="text-grayBlueText text-base">
              <div className="text-grayBlueText text-base">
                © {new Date().getFullYear()} {t("copyRightightsYear",)}
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

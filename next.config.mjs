import createNextIntlPlugin from "next-intl/plugin";

// Use the next-intl plugin to handle i18n
const withNextIntl = createNextIntlPlugin();

// Next.js config
const nextConfig = {
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: {
    domains: [
      "logo.clearbit.com",
      "jsmapi.smarttechnica.com",
      "192.168.1.29",
      "192.168.1.10",
      "192.168.1.25",
      "api.joinjasmina.com",
      "stageapi.joinjasmina.com",
      "res.cloudinary.com",
    ],
  },
};

export default withNextIntl(nextConfig);
//

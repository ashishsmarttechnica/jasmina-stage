import CreateProfileTabMenu from "@/components/user/createUserProfile/CreateProfileTabMenu";
import { getSeoMeta } from "@/lib/seoMetadata";
import React from "react";


export const metadata = getSeoMeta({
  title: "Feed | Jasmina",
  path: "/create-profile",
});

const page = () => {
  return (
    <>
      <CreateProfileTabMenu />
    </>
  );
};

export default page;

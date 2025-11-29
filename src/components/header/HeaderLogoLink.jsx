"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import HeaderLogo from "@/assets/header/HeaderLogo.png";

const HeaderLogoLink = ({ logoHref = "/" }) => {
  return (
    <div className="flex items-center gap-2">
      <Link href={logoHref}>
        <Image src={HeaderLogo} alt="Logo" width={31} height={31} />
      </Link>
    </div>
  );
};

export default HeaderLogoLink;

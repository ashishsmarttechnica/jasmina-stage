"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import BackGroundLayout from "../../../components/BackGroundOverlay/BackGroundLayout";
import Header from "../../../components/header/Header";
import UserHeader from "../../../components/header/UserHeader";

export default function PagedetailLayout({ children }) {
    const [isLoggedIn] = useState(() => Boolean(Cookies.get("token")));

    return (
        <>
            {isLoggedIn ? <UserHeader /> : <Header isLogin={false} />}
            <BackGroundLayout />
            {children}
        </>
    );
}

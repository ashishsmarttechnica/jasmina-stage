"use client";
import ConnectionSkeleton from "@/common/skeleton/ConnectionSkeleton";
import useTabUnderlineAnimation from "@/hooks/connections/animation/useTabUnderlineAnimation";
import {
  useOthersCompanyConnections,
  useOthersUserConnections,
} from "@/hooks/connections/useConnections";
import useConnectionsStore from "@/store/connections.store";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ConnectionHeader from "./ConnectionHeader";
import ConnectionsList from "./ConnectionsList";
import EmptyState from "./EmptyState";
import ErrorDisplay from "./ErrorDisplay";
import TabsWithUnderline from "./TabsWithUnderline";

const ConnectionsContent = () => {
  const searchParams = useSearchParams();
  // userId = logged-in user, profileId = profile being viewed
  const viewerId = Cookies.get("userId");
  const profileId = searchParams.get("profileId") || viewerId;
  const profileType = searchParams.get("type") || "User";
  const tabParam = searchParams.get("tab");
  const peopleRef = useRef(null);
  const companyRef = useRef(null);
  const userRole = Cookies.get("userRole");

  // Set default tab based on user role if no tab parameter is provided
  const getDefaultTab = () => {
    if (tabParam) return tabParam;
    if (userRole === "company") return "company";
    return "people";
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  // console.log(activeTab, "activeTab");
  const [userPage, setUserPage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);

  const userType = activeTab === "people" ? "User" : "Company";
  const {
    connections: userConnections,
    pagination: userPagination,
    hasMore: userHasMore,
    resetConnections: resetUserConnections,
  } = useConnectionsStore();
  const {
    connections: companyConnections,
    pagination: companyPagination,
    hasMore: companyHasMore,
    resetConnections: resetCompanyConnections,
  } = useConnectionsStore();

  const { underlineStyle, hoverStyle, handleHover, handleHoverLeave } = useTabUnderlineAnimation(
    activeTab,
    peopleRef,
    companyRef
  );

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
    isFetching: isUserFetching,
  } = useOthersUserConnections(userPage, undefined, {
    enabled: activeTab === "people",
    userId: viewerId,
    profileId: profileId,
    userType: profileType,
  });

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
    refetch: refetchCompany,
    isFetching: isCompanyFetching,
  } = useOthersCompanyConnections(companyPage, undefined, {
    enabled: activeTab === "company",
    userId: viewerId,
    profileId: profileId,
    userType: profileType,
  });

  const currentConnections = activeTab === "people" ? userConnections : companyConnections;
  const currentPagination = activeTab === "people" ? userPagination : companyPagination;
  const currentHasMore = activeTab === "people" ? userHasMore : companyHasMore;
  const currentData = activeTab === "people" ? userData : companyData;
  const isLoading = activeTab === "people" ? isUserLoading : isCompanyLoading;
  const isError = activeTab === "people" ? isUserError : isCompanyError;
  const error = activeTab === "people" ? userError : companyError;
  const isFetching = activeTab === "people" ? isUserFetching : isCompanyFetching;

  const displayData = currentConnections?.length ? currentConnections : currentData?.connections;

  const isInitialLoad = !currentConnections?.length && (isLoading || !currentData);
  const showLoader = isInitialLoad;
  const noData = !isLoading && !isFetching && currentConnections.length === 0;

  useEffect(() => {
    if (activeTab === "people") {
      setUserPage(1);
      resetUserConnections();
    } else {
      setCompanyPage(1);
      resetCompanyConnections();
    }
  }, [activeTab]);

  // Handle tab parameter from URL
  useEffect(() => {
    if (tabParam) {
      if (tabParam === "people" || tabParam === "company") {
        setActiveTab(tabParam);
      }
    }
  }, [tabParam]);

  // Handle initial tab setting and role-based defaults
  useEffect(() => {
    const defaultTab = getDefaultTab();
    if (defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, []);

  const loadMore = () => {
    if (activeTab === "people") {
      if (!userPagination || userPage >= userPagination.totalPages) return;
      setUserPage((prev) => prev + 1);
    } else {
      if (!companyPagination || companyPage >= companyPagination.totalPages) return;
      setCompanyPage((prev) => prev + 1);
    }
  };

  if (showLoader) {
    return (
      <div className="rounded-md bg-white shadow">
        <div className="invisible absolute z-10 bg-white opacity-0">
          <ConnectionHeader />
          <TabsWithUnderline
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            peopleRef={peopleRef}
            companyRef={companyRef}
            hoverStyle={hoverStyle}
            underlineStyle={underlineStyle}
            handleHover={handleHover}
            handleHoverLeave={handleHoverLeave}
          />
        </div>

        <ConnectionSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-white shadow">
        <div className="z-10 bg-white">
          <ConnectionHeader />
          <TabsWithUnderline
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            peopleRef={peopleRef}
            companyRef={companyRef}
            hoverStyle={hoverStyle}
            underlineStyle={underlineStyle}
            handleHover={handleHover}
            handleHoverLeave={handleHoverLeave}
          />
        </div>

        <ErrorDisplay
          error={error}
          refetchFn={() => (activeTab === "people" ? refetchUser() : refetchCompany())}
        />
      </div>
    );
  }

  if (noData) {
    return (
      <div className="rounded-md bg-white shadow">
        <div className="z-10 bg-white">
          <ConnectionHeader />
          <TabsWithUnderline
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            peopleRef={peopleRef}
            companyRef={companyRef}
            hoverStyle={hoverStyle}
            underlineStyle={underlineStyle}
            handleHover={handleHover}
            handleHoverLeave={handleHoverLeave}
          />
        </div>

        <EmptyState activeTab={activeTab} />
      </div>
    );
  }

  return (
    <>

      <div className="rounded-md bg-white shadow">
        <div className="z-10 bg-white">
          <ConnectionHeader />
          <TabsWithUnderline
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            peopleRef={peopleRef}
            companyRef={companyRef}
            hoverStyle={hoverStyle}
            underlineStyle={underlineStyle}
            handleHover={handleHover}
            handleHoverLeave={handleHoverLeave}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", minHeight: "500px" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-[500px] overflow-hidden px-4 !pt-0 sm:p-6"
          >
            <ConnectionsList
              profileId={profileId}
              userData={userData}
              activeTab={activeTab}
              connections={currentConnections}
              hasMore={currentHasMore}
              isFetching={isFetching}
              loadMore={loadMore}
            />
          </motion.div>
        </AnimatePresence>
      </div>

    </>
  );
};

export default ConnectionsContent;

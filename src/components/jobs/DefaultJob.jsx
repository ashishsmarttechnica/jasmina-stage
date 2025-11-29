import { useState } from "react";
// import JobCards from "../JobCards";
import JobHeader from "../JobHeader";
import JobCards from "./JobCards";

const DefaultJob = () => {
  // This state is for the actual filters used for searching
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    lgbtq: true, // Default to LGBTQ+ to match JobHeader's default selection
  });
  // This state is for the input fields (controlled by JobHeader)
  const [filtersInput, setFiltersInput] = useState({
    search: "",
    location: "",
    lgbtq: true, // Default to LGBTQ+ to match JobHeader's default selection
  });

  // Handle Find Job button click
  const handleFindJob = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-full">
      <JobHeader filters={filtersInput} setFilters={setFiltersInput} onFindJob={handleFindJob} />
      <div className="mt-4 flex flex-col gap-4">
        <div className="">
          <JobCards filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default DefaultJob;

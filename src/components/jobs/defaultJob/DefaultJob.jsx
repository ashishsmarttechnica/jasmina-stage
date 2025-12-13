"use client";
// import JobCards from "../JobCards";
import JobCards from "../JobCards";
import JobHeader from "../JobHeader";

const DefaultJob = ({ filters, setFilters }) => {
  // const [filters, setFilters] = useState({
  //   search: "",
  //   location: "",
  //   lgbtq: true,
  // });
  return (
    <div className="w-full myjob-card">
      <div className="d-hidden block">
        <JobHeader filters={filters} setFilters={setFilters} />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <div className="">
          <JobCards filters={filters} />
        </div>
        <div className=" ">{/* <SingleJobDetail /> */}</div>
      </div>
    </div>
  );
};

export default DefaultJob;

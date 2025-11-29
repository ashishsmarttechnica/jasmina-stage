import React from "react";

const JobsLayout = ({ children, leftComponents = [] }) => {
  return (
    <div className="container mx-auto px-2 sm:px-4 pb-20 md:pb-0 myjob-card">
      <div className="grid grid-cols1 gap-4 grid-cols-12">
        {/* Left Sidebar */}
        <aside className="col-span12 w-full col-span-3 block">
          <div className="sticky top-16 space-y-4">
            {leftComponents.map((component, index) => (
              <React.Fragment key={index}>{component}</React.Fragment>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span12 w-full col-span-9">{children}</main>
      </div>
    </div>
  );
};

export default JobsLayout;

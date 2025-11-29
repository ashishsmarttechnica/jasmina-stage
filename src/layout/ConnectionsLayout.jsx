import React from 'react'

const ConnectionsLayout = ({ children, RightComponents = [] }) => {
  return (
    <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Main Content */}
      {/* Right Sidebar */}
      <main className="lg:col-span-9 col-span-12">{children}</main>
      <aside className="lg:col-span-3 hidden lg:block">
        <div className="sticky top-16 space-y-4">
          {RightComponents.map((component, index) => (
            <React.Fragment key={index}>{component}</React.Fragment>
          ))}
        </div>
      </aside>

    </div>
  </div>
  )
}

export default ConnectionsLayout
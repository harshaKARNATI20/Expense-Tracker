import React from 'react';
import Sidebar from '../SideBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Scrollable main content with proper left margin */}
      <main className="ml-10 h-screen overflow-y-auto w-full bg-[#fcfbfc] px-6 py-6">
        {children}
      </main>
      {/* <main className="ml-60 px-6 py-6 w-full">{children}</main> */}

    </div>
  );
};

export default MainLayout;

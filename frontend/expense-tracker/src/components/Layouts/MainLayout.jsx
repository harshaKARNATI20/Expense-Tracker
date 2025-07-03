import React from 'react';
import Sidebar from '../SideBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 w-full min-h-screen bg-[#fcfbfc]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

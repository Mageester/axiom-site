import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="relative min-h-screen bg-axiom-base pt-24 md:pt-28">{children}</div>;
};

export default Layout;

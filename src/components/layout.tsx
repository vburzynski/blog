import React, { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';
import svg from '../images/circuit-board.svg';

export interface LayoutProps {
  section: string;
  children?: ReactNode;
}

function Layout({ section, children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen font-sans leading-normal tracking-normal bg-shadow">
      <Header section={section} />
      <div className="grow pt-11 lg:pt-16" style={{ backgroundImage: `url(${svg})` }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;

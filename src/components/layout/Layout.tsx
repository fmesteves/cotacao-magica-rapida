import { ReactNode, useState } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
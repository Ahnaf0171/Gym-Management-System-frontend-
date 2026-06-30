import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/SideBar";
import { useAuth } from "@/context/AuthContext";

export function PublicLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {user && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <main
        className={`flex-1 mt-[var(--navbar-height)] ${
          user ? "md:ml-60" : ""
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
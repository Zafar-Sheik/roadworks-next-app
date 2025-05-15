// app/user/jobs/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsOpen(!isMobileView);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Backdrop (Mobile Only) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed z-50 bg-white shadow-xl transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full md:translate-x-0 md:w-20"
          }
          md:relative`}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b p-4">
            {isOpen ? (
              <h2 className="text-lg font-semibold text-gray-800">
                Job Portal
              </h2>
            ) : (
              <div className="h-8 w-8" /> // Spacer for collapsed state
            )}
            <button
              onClick={toggleSidebar}
              className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:block">
              <ChevronLeftIcon
                className={`h-6 w-6 transition-transform ${
                  !isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <SidebarLink
                href="/user"
                icon={HomeIcon}
                text="Home"
                isOpen={isOpen}
              />
              <SidebarLink
                href="/user/jobs"
                icon={BriefcaseIcon}
                text="Active Jobs"
                isOpen={isOpen}
              />
              <SidebarLink
                href="/user/completed-jobs"
                icon={CheckCircleIcon}
                text="Completed Jobs"
                isOpen={isOpen}
              />
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? "md:ml-10" : "md:ml-10"
        }`}>
        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b bg-white p-4 md:hidden">
          <h1 className="text-xl font-semibold text-gray-800">Jobs</h1>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </header>

        {/* Content Container */}
        <div className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  text,
  isOpen,
}: {
  href: string;
  icon: any;
  text: string;
  isOpen: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-lg p-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
        <Icon className="h-6 w-6 flex-shrink-0 text-gray-500" />
        <span
          className={`text-sm font-medium transition-opacity ${
            isOpen ? "opacity-100" : "md:opacity-0"
          }`}>
          {text}
        </span>
        {!isOpen && (
          <span className="absolute left-20 ml-2 hidden -translate-y-2 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 md:block">
            {text}
          </span>
        )}
      </Link>
    </li>
  );
}

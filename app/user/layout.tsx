// app/dashboard/layout.tsx
import Link from "next/link";
import {
  Cog6ToothIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-64 w-16 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
        <div className="p-4">
          <nav className="mt-4">
            <ul className="space-y-2">
              <SidebarLink href="/user/jobs" icon={BriefcaseIcon} text="Jobs" />

              <SidebarLink
                href="/user/completed-jobs"
                icon={Cog6ToothIcon}
                text="My Completed Jobs"
              />
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  text,
}: {
  href: string;
  icon: any;
  text: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group">
        <Icon className="h-6 w-6 md:mr-3" />
        <span className="hidden md:inline text-sm font-medium">{text}</span>
      </Link>
    </li>
  );
}

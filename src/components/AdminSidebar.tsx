import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Archive,
  ShieldCheck,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  closeSidebar: () => void;
}

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    Icon: LayoutDashboard,
    matchEnd: true,
    iconClassName: "text-blue-600",
    iconWrapperClassName: "bg-blue-500/10",
  },
  {
    to: "/admin/teacherdirectory",
    label: "Teacher Profile",
    Icon: Users,
    iconClassName: "text-violet-600",
    iconWrapperClassName: "bg-violet-500/10",
  },
  {
    to: "/admin/documentrepository",
    label: "Document Repository",
    Icon: FolderKanban,
    iconClassName: "text-amber-600",
    iconWrapperClassName: "bg-amber-500/10",
  },
  {
    to: "/admin/archivedrepository",
    label: "Archived Repository",
    Icon: Archive,
    iconClassName: "text-rose-600",
    iconWrapperClassName: "bg-rose-500/10",
  },
];

const AdminSidebar: React.FC<Props> = ({ isOpen, closeSidebar }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Handle clicking outside on mobile to close
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        window.innerWidth < 1024 &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, closeSidebar]);

  return (
    <>
      <aside
        className={`fixed z-30 flex h-[calc(100vh-60px)] overflow-hidden border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:relative md:left-0 md:mr-5 md:translate-x-0 ${
          isOpen
            ? "w-72 translate-x-0 opacity-100"
            : "w-0 -translate-x-[110%] opacity-0 lg:mr-0 lg:w-0 lg:translate-x-0 lg:border-none"
        } `}
      >
        <div className="flex h-full w-72 flex-col">
          {/* SIDEBAR HEADER */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold tracking-tight text-slate-900 uppercase">
                  KCSSC
                </h2>
                <p className="truncate text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Admin Portal
                </p>
              </div>
            </div>
          </div>

          {/* SIDEBAR NAVIGATION */}
          <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1.5">
              {navItems.map(({ to, label, Icon, matchEnd }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={matchEnd}
                    onClick={(): void => {
                      closeSidebar();
                    }}
                    className={({ isActive }: { isActive: boolean }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      } `
                    }
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <>
                        <Icon
                          className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className="text-sm font-semibold tracking-tight">
                          {label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* SIDEBAR FOOTER (Optional) */}
          <div className="border-t border-slate-100 p-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                System Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-600">
                  All Systems Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

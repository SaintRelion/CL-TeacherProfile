import {
  Archive,
  FolderKanban,
  LayoutDashboard,
  PanelLeftClose,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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

const AdminSidebar = ({ isOpen, closeSidebar }: Props) => {
  return (
    <>
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-200/60 bg-slate-50
          shadow-xl shadow-slate-200/60 transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="border-b border-slate-200/70 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <img src="/background_logo.png" alt="" className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-slate-900">
                  KCSSC
                </h2>
                <p className="truncate text-xs font-medium text-slate-500">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={closeSidebar}
              className="rounded-xl p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(
              ({ to, label, Icon, matchEnd, iconClassName, iconWrapperClassName }) => (
                <li key={to}>
                  <NavLink
                    end={matchEnd}
                    to={to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/15"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-white/15 text-white"
                              : `${iconWrapperClassName} ${iconClassName}`
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;

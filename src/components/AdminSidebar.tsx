import { useState } from "react";
import { renderNavItems } from "@saintrelion/routers";
import { useResponsive } from "@/hooks/useResponsive";

const AdminSidebar = () => {
  const { isMobile } = useResponsive();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Hamburger (only mobile + tablet) */}
      {isMobile && (
        <button
          onClick={handleToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md lg:hidden"
        >
          ☰
        </button>
      )}

      {/* Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          bg-white shadow-lg
          transition-transform duration-300
          w-64 h-full
          ${isMobile ? "fixed z-50" : "relative"}
          ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <nav className="p-6">
          <ul className="space-y-2">
            {renderNavItems({
              role: "admin",
              baseClassName:
                "text-secondary-600 flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-50",
              activeClassName:
                "bg-primary-50 text-primary-800 flex items-center space-x-3 rounded-lg px-4 py-3 font-medium",
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
import { renderNavItems } from "@saintrelion/routers";

interface Props {
  isOpen: boolean;
  closeSidebar: () => void;
}

const AdminSidebar = ({ isOpen, closeSidebar }: Props) => {
  return (
    <>
      {/* Overlay (Mobile Only) */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-64 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* 🔥 LOGO SECTION */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 rounded-lg p-2">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                KCSS
              </h2>
              <p className="text-xs text-slate-500">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-800"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6">
          <ul className="space-y-2">
            {renderNavItems({
              role: "admin",
              baseClassName:
                "text-secondary-600 flex items-center space-x-3 rounded-lg px-4 py-3 transition hover:bg-slate-100",
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
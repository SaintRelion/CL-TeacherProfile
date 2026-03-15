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
          h-full w-64 bg-white shadow-lg border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* 🔥 LOGO SECTION */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2 shadow-md flex-shrink-0">
              <img src="/background_logo.png" alt="" className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                KCSSC
              </h2>
              <p className="text-xs text-gray-500 truncate">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <ul className="space-y-1">
            {renderNavItems({
              role: "admin",
              baseClassName:
                "text-gray-600 flex items-center space-x-3 rounded-lg px-4 py-2.5 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm",
              activeClassName:
                "bg-blue-100 text-blue-700 flex items-center space-x-3 rounded-lg px-4 py-2.5 font-semibold shadow-sm border-l-4 border-blue-600",
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
import { renderNavItems } from "@saintrelion/routers";

const Sidebar = () => {
  return (
    <aside className="min-h-screen w-64 bg-white shadow-lg">
      <nav className="p-6">
        <ul className="space-y-2">
          {renderNavItems({
            role: "",
            baseClassName:
              "text-secondary-600 flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-50",
            activeClassName:
              "bg-primary-50 text-primary-800 flex items-center space-x-3 rounded-lg px-4 py-3 font-medium",
          })}
        </ul>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-secondary-700 mb-3 text-sm font-semibold">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="bg-accent-500 hover:bg-accent-600 flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-white transition-colors">
              <i className="fas fa-plus"></i>
              <span>Add Teacher</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-white transition-colors">
              <i className="fas fa-upload"></i>
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};
export default Sidebar;

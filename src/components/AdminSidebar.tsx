import { renderNavItems } from "@saintrelion/routers";

const AdminSidebar = () => {
  return (
    <aside className="min-h-screen w-64 bg-white shadow-lg">
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
  );
};
export default AdminSidebar;

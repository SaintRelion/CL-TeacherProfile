import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import KPICard from "@/components/dashboard/KPICard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";

const DashboardPage = () => {
  const mockKPI: Record<string, string>[] = [
    {
      title: "Total Teachers",
      value: "247",
      details: "+12 this month",
      detailsIcon: "fas fa-arrow-up",
      kpiIcon:
        "fas fa-chalkboard-teacher text-primary-600 text-xl bg-primary-100 p-3 rounded-lg",
    },
    {
      title: "Documents Processed",
      value: "1,834",
      details: "+156 this month",
      detailsIcon: "fas fa-arrow-up",
      kpiIcon:
        "fas fa-file-alt text-accent-600 text-xl bg-accent-100 p-3 rounded-lg",
    },

    {
      title: "Compliance Rate",
      value: "94.5%",
      details: "14 expiring soon",
      detailsIcon: "fas fa-exclamation-triangle",
      kpiIcon:
        "fas fa-shield-alt text-success-600 text-xl bg-success-100 p-3 rounded-lg",
    },

    {
      title: "Pending Actions",
      value: "23",
      details: "Requires attention",
      detailsIcon: "fas fa-clock",
      kpiIcon:
        "fas fa-tasks text-error-600 text-xl bg-error-100 p-3 rounded-lg",
    },
  ];

  const mockRecent: Record<string, string>[] = [
    {
      iconClassName: "fas fa-user-plus text-success-600",
      title: "New teacher profile created",
      description: "Dr. Elena Rodriguez - Mathematics Department",
      time: "2 hours ago",
    },
    {
      iconClassName: "fas fa-file-upload text-primary-600",
      title: "Document uploaded",
      description: "Teaching License - Prof. Juan Dela Cruz",
      time: "4 hours ago",
    },
    {
      iconClassName: "fas fa-edit text-accent-600",
      title: "Profile updated",
      description: "Ms. Ana Reyes - Contact information",
      time: "6 hours ago",
    },
    {
      iconClassName: "fas fa-exclamation-triangle text-warning-600",
      title: "Certification expiring",
      description: "Mr. Carlos Mendoza - CPD Certificate",
      time: "1 day ago",
    },
  ];

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <div className="from-primary-800 to-primary-600 rounded-xl bg-gradient-to-r p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Welcome back, Maria!</h2>
              <p className="text-primary-100">
                Here's what's happening at your school today
              </p>
              <p className="text-primary-200 mt-1 text-sm">
                Last login: September 19, 2025 at 8:30 AM
              </p>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="School Administration"
                className="border-primary-400 h-24 w-24 rounded-full border-4 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockKPI.map((value, index) => (
          <KPICard key={index} kvp={value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h3 className="text-secondary-900 text-lg font-semibold">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockRecent.map((value, index) => (
                  <RecentActivityCard key={index} kvp={value} />
                ))}
              </div>
              <button className="text-primary-600 hover:text-primary-700 mt-4 w-full text-sm font-medium">
                View all activity
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-secondary-900 text-lg font-semibold">
                  Compliance Status
                </h3>
                <span className="text-secondary-600 text-sm">
                  Updated 2 hours ago
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <ComplianceStatusCard
                  wrapperColor="bg-success-50"
                  iconClassName="fas fa-check text-white bg-success-500 rounded-lg p-2"
                  title="Teaching Licenses"
                  description="All current and valid"
                  value="100%"
                  valueClassName="text-success-600 font-semibold"
                />
                <ComplianceStatusCard
                  wrapperColor="bg-warning-50"
                  iconClassName="fas fa-exclamation-triangle text-white bg-warning-500 rounded-lg p-2"
                  title="CPD Certificates"
                  description="14 expiring within 30 days"
                  value="94%"
                  valueClassName="text-warning-600 font-semibold"
                />
                <ComplianceStatusCard
                  wrapperColor="bg-primary-50"
                  iconClassName="fas fa-exclamation-triangle text-white bg-primary-600 rounded-lg p-2"
                  title="Educational Credentials"
                  description="All verified and up-to-date"
                  value="98%"
                  valueClassName="text-primary-600 font-semibold"
                />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 mt-4 w-full rounded-lg px-4 py-2 font-medium text-white transition-colors">
                View Detailed Compliance Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DashboardPage;

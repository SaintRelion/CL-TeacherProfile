import AddTeacherForm from "@/components/teacher-directory/AddTeacher";
import BulkActions from "@/components/teacher-directory/BulkActions";
import Filters from "@/components/teacher-directory/Filters";
import TeacherCard from "@/components/teacher-directory/TeacherCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";

const TeacherDirectoryPage = () => {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({
    department: "",
    certificationStatus: "",
    yearsOfService: "",
    performanceRating: "",
  });

  const mockTeacher: Record<string, string>[] = [
    {
      name: "Dr. Elena Rodriguez",
      photoURL:
        "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400",
      department: "Mathematics Department",
      employeeID: "TCH-2021-001",
      yearOfService: "8 years",
      rating: "5",
      status: "Current",
      statusColor: "bg-success-500",
    },
    {
      name: "Prof. Juan Dela Cruz",
      photoURL:
        "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop",
      department: "Science Department",
      employeeID: "TCH-2019-045",
      yearOfService: "12 years",
      rating: "4",
      status: "Expiring",
      statusColor: "bg-warning-500",
    },
    {
      name: "Ms. Ana Reyes",
      photoURL:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      department: "English Department",
      employeeID: "TCH-2022-089",
      yearOfService: "3 years",
      rating: "5",
      status: "Current",
      statusColor: "bg-success-500",
    },
    {
      name: "Mr. Carlos Mendoza",
      photoURL:
        "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop",
      department: "Physical Education",
      employeeID: "TCH-2018-123",
      yearOfService: "15 years",
      rating: "3",
      status: "Expired",
      statusColor: "bg-error-500",
    },
    {
      name: "Dr. Maria Santos",
      photoURL:
        "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop",
      department: "Social Studies",
      employeeID: "TCH-2020-067",
      yearOfService: "6 years",
      rating: "4",
      status: "Current",
      statusColor: "bg-success-500",
    },
  ];

  const filteredTeachers = mockTeacher.filter((t) => {
    const name = t.name.toLowerCase();
    const department = t.department.toLowerCase();
    const employeeID = t.employeeID.toLowerCase();
    const rating = t.rating.toLowerCase();
    const yearOfService = t.yearOfService.toLowerCase();
    const status = t.status.toLowerCase();

    // --- TEXT SEARCH ---
    const s = search.toLowerCase();
    if (s != "") {
      const matchesSearch =
        name.includes(s) || department.includes(s) || employeeID.includes(s);

      if (!matchesSearch) return false;
    }

    // --- FILTERS (case-insensitive) ---
    if (
      filters.department &&
      department !== filters.department.toLowerCase().replaceAll("-", " ")
    )
      return false;

    if (
      filters.performanceRating &&
      rating !== filters.performanceRating.toLowerCase()
    )
      return false;

    if (
      filters.yearsOfService &&
      yearOfService !==
        filters.yearsOfService.toLowerCase().replaceAll("-", " ")
    )
      return false;

    if (
      filters.certificationStatus &&
      status !== filters.certificationStatus.toLowerCase().replaceAll("-", " ")
    )
      return false;

    return true;
  });

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-secondary-900 text-3xl font-bold">
              Teacher Directory
            </h2>
            <p className="text-secondary-600 mt-1">
              Manage and view all teacher profiles in your institution
            </p>
          </div>
          <Dialog>
            <DialogTrigger>
              <button className="bg-accent-500 hover:bg-accent-600 flex items-center space-x-2 rounded-lg px-4 py-2 text-white transition-colors">
                <i className="fas fa-plus"></i>
                <span>Add Teacher</span>
              </button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <DialogHeader>
                <DialogTitle>Add Teacher</DialogTitle>
                <DialogDescription>
                  Click the "Add Teacher" button to add a new teacher to the
                  system.
                </DialogDescription>
              </DialogHeader>
              <AddTeacherForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Filters
        dataCount={filteredTeachers.length.toString()}
        filters={filters}
        onSearchChange={(search) => setSearch(search)}
        onFilterChange={(filterType, value) => {
          if (filterType === "reset") {
            setFilters({
              department: "",
              certificationStatus: "",
              yearsOfService: "",
              performanceRating: "",
            });
            return;
          }

          setFilters((prev) => ({ ...prev, [filterType]: value }));
        }}
      />

      {selectedTeachers.length > 0 && (
        <BulkActions
          teacherIds={selectedTeachers}
          onClear={() => setSelectedTeachers([])}
        />
      )}

      <div
        id="teachersGrid"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredTeachers.map((value, index) => (
          <TeacherCard
            key={index}
            kvp={value}
            isSelected={selectedTeachers.indexOf(value.employeeID) != -1}
            onTeacherSelect={(employeeID, checked) => {
              setSelectedTeachers(
                (prev) =>
                  checked
                    ? [...prev, employeeID] // Add ID when checked
                    : prev.filter((id) => id !== employeeID), // Remove ID when unchecked
              );
            }}
          />
        ))}
      </div>

      <div
        id="teachersList"
        className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
                  />
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Teacher
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Department
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Employee ID
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Experience
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Status
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Performance
                </th>
                <th className="text-secondary-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src="https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Dr. Elena Rodriguez"
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-secondary-900 text-sm font-medium">
                        Dr. Elena Rodriguez
                      </div>
                      <div className="text-secondary-500 text-sm">
                        elena.rodriguez@school.edu
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-secondary-900 px-6 py-4 text-sm">
                  Mathematics
                </td>
                <td className="text-secondary-900 px-6 py-4 text-sm">
                  TCH-2021-001
                </td>
                <td className="text-secondary-900 px-6 py-4 text-sm">
                  8 years
                </td>
                <td className="px-6 py-4">
                  <span className="bg-success-100 text-success-800 inline-flex rounded-full px-2 py-1 text-xs font-semibold">
                    Current
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-star text-warning-500 text-xs"></i>
                    <i className="fas fa-star text-warning-500 text-xs"></i>
                    <i className="fas fa-star text-warning-500 text-xs"></i>
                    <i className="fas fa-star text-warning-500 text-xs"></i>
                    <i className="fas fa-star text-warning-500 text-xs"></i>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-900">
                      View
                    </button>
                    <button className="text-secondary-400 hover:text-secondary-600">
                      <i className="fas fa-envelope"></i>
                    </button>
                    <button className="text-secondary-400 hover:text-secondary-600">
                      <i className="fas fa-phone"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-secondary-600 text-sm">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">20</span> of{" "}
          <span className="font-medium">{filteredTeachers.length}</span>{" "}
          teachers
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="text-secondary-600 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="bg-primary-600 rounded-lg px-3 py-2 text-sm text-white">
            1
          </button>
          <button className="text-secondary-600 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            2
          </button>
          <button className="text-secondary-600 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            3
          </button>
          <span className="text-secondary-600 px-3 py-2 text-sm">...</span>
          <button className="text-secondary-600 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            13
          </button>
          <button className="text-secondary-600 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>
    </main>
  );
};
export default TeacherDirectoryPage;

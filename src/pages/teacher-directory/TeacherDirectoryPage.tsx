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
import { NO_FACE_IMAGE } from "@/constants";
import { getYearsOfService, getExpiryState } from "@/lib/utils";
import type { TeacherPerformance } from "@/models/Performance";
import { type PersonalInformation } from "@/models/PersonalInformation";
import type { User } from "@/models/User";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useState } from "react";

function createFallbackTeacher(user: User): PersonalInformation {
  return {
    id: "",
    userId: "",
    employeeId: "",
    photoBase64: "",
    firstName: user.username ?? "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    civilStatus: "",
    email: "",
    mobileNumber: "",
    homeAddress: "",
    position: "",
    department: "",
    employmentStatus: "",
    dateHired: "",
    salaryGrade: "",
    tin: "",
  };
}

const TeacherDirectoryPage = () => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getTeacherInformation } =
    useResourceLocked<PersonalInformation>("personalinformation");
  const { useList: getTeacherPerformance } =
    useResourceLocked<TeacherPerformance>("teacherperformance");
  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");

  const [selectedTeachersId, setSelectedTeachers] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Record<string, string>>({
    department: "",
    certificationStatus: "",
    yearsOfService: "",
    performanceRating: "",
  });

  const users = getUsers().data;
  const teachersInformation = getTeacherInformation().data;
  const teacherPerformances = getTeacherPerformance().data;
  const documents = getDocuments().data;

  const filteredTeachers = users
    .map((user) => {
      const teacherInformation =
        teachersInformation?.find((ti) => ti.userId == user.id) ??
        createFallbackTeacher(user);

      if (teacherInformation.photoBase64 == "")
        teacherInformation.photoBase64 = NO_FACE_IMAGE;

      const teacherPerformance = teacherPerformances.find(
        (p) => p.userId == user.id,
      );

      if (teacherPerformance == null) return null; // Shouldn't happen

      // Create searchable fields
      const name =
        `${teacherInformation.firstName} ${teacherInformation.middleName} ${teacherInformation.lastName}`.toLowerCase();
      const department = teacherInformation.department.toLowerCase();
      const employeeID = teacherInformation.employeeId.toLowerCase();
      const yearOfService = teacherInformation.dateHired
        ? getYearsOfService(teacherInformation.dateHired).toLowerCase()
        : "";

      // ---------- SEARCH ----------
      const s = search.toLowerCase();
      if (s !== "") {
        const matchesSearch =
          name.includes(s) || department.includes(s) || employeeID.includes(s);

        if (!matchesSearch) return null;
      }

      // ---------- FILTERS ----------
      // Department filter
      if (filters.department) {
        const filterDept = filters.department
          .toLowerCase()
          .replaceAll("-", " ");
        if (!department.includes(filterDept)) {
          return null;
        }
      }

      // Certification Status filter (checks document expiry status)
      if (filters.certificationStatus && filters.certificationStatus !== "") {
        const teacherDocs =
          documents?.filter((doc) => doc.userId === user.id) || [];
        let hasStatus = false;

        if (filters.certificationStatus === "current") {
          hasStatus = teacherDocs.some(
            (doc) => getExpiryState(doc.expiryDate) === "valid",
          );
        } else if (filters.certificationStatus === "expiring") {
          hasStatus = teacherDocs.some(
            (doc) => getExpiryState(doc.expiryDate) === "expiring",
          );
        } else if (filters.certificationStatus === "expired") {
          hasStatus = teacherDocs.some(
            (doc) => getExpiryState(doc.expiryDate) === "expired",
          );
        }

        if (!hasStatus) {
          return null;
        }
      }

      // Years of Service filter
      if (filters.yearsOfService && filters.yearsOfService !== "") {
        if (yearOfService !== filters.yearsOfService) {
          return null;
        }
      }

      // Performance Rating filter
      if (
        filters.performanceRating &&
        teacherPerformance.rating.toLowerCase() !==
          filters.performanceRating.toLowerCase()
      )
        return null;

      return {
        ...teacherInformation,
        rating: teacherPerformance.rating,
      };
    })
    .filter(Boolean);

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
        >
          <i className="fas fa-arrow-left text-lg"></i>
          <span className="font-medium">Back</span>
        </button>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              Teacher Directory
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and view all registered teachers
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl">
                <i className="fas fa-user-plus transition-transform duration-200 group-hover:scale-110"></i>
                <span>Add Teacher</span>
              </button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                    <i className="fas fa-user-plus text-white"></i>
                  </div>
                  Add New Teacher
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Register a new faculty member to the system.
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
        onViewChange={(view) => setGridView(view)}
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

      {selectedTeachersId.length > 0 && (
        <BulkActions
          teacherIds={selectedTeachersId}
          onClear={() => setSelectedTeachers([])}
        />
      )}

      {/* Teachers Grid */}
      <div
        className={
          gridView === "grid"
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-3"
        }
      >
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map(
            (value, index) =>
              value && (
                <TeacherCard
                  key={index}
                  info={value}
                  isSelected={selectedTeachersId.indexOf(value.userId) != -1}
                  onTeacherSelect={(userId, checked) => {
                    if (userId != "")
                      setSelectedTeachers((prev) =>
                        checked
                          ? [...prev, userId]
                          : prev.filter((id) => id !== userId),
                      );
                  }}
                />
              ),
          )
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <i className="fas fa-users text-2xl text-slate-400"></i>
            </div>
            <p className="text-lg font-medium text-slate-600">
              No teachers found
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">1</span> to{" "}
          <span className="font-semibold text-slate-900">
            {Math.min(20, filteredTeachers?.length || 0)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {filteredTeachers?.length || 0}
          </span>{" "}
          teachers
        </p>
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-medium text-white">
            1
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
            2
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
            3
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </main>
  );
};
export default TeacherDirectoryPage;

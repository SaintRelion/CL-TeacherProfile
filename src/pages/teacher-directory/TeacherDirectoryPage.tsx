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
import type { TeacherPerformance } from "@/models/TeacherPerformance";
import { type PersonalInformation } from "@/models/PersonalInformation";
import type { User } from "@/models/user";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useState, useEffect } from "react";

function createFallbackTeacher(user: User): PersonalInformation {
  return {
    id: "",
    user: user.id,
    employee_id: "",
    photo_base64: "",
    first_name: user.username ?? "",
    last_name: "",
    middle_name: "",
    date_of_birth: "",
    gender: "",
    civil_status: "",
    email: "",
    mobile_number: "",
    home_address: "",
    position: "",
    department: "",
    employment_status: "",
    date_hired: "",
    salary_grade: "",
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
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState({
    department: "",
    certificationStatus: "",
    yearsOfService: "",
    performanceRating: "",
  });

  // ⭐ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const users = getUsers().data ?? [];
  const teachersInformation = getTeacherInformation().data ?? [];
  const teacherPerformances = getTeacherPerformance().data ?? [];
  const documents = getDocuments().data ?? [];

  // ---------- FILTERING ----------
  const filteredTeachers = users
    .map((user) => {
      const info =
        teachersInformation.find((ti) => ti.user === user.id) ??
        createFallbackTeacher(user);

      if (!info.photo_base64) info.photo_base64 = NO_FACE_IMAGE;

      const performance = teacherPerformances.find(
        (p) => p.user === user.id,
      );
      if (!performance) return null;

      const name =
        `${info.first_name} ${info.middle_name} ${info.last_name}`.toLowerCase();
      const department = info.department.toLowerCase();
      const employeeID = info.employee_id.toLowerCase();
      const yearOfService = info.date_hired
        ? getYearsOfService(info.date_hired).toLowerCase()
        : "";

      // SEARCH
      const s = search.toLowerCase();
      if (s && !(name.includes(s) || department.includes(s) || employeeID.includes(s)))
        return null;

      // FILTERS
      if (
        filters.department &&
        !department.includes(filters.department.toLowerCase().replaceAll("-", " "))
      )
        return null;

      if (filters.certificationStatus) {
        const teacherDocs = documents.filter((doc) => doc.user === user.id);
        const hasStatus = teacherDocs.some(
          (doc) =>
            getExpiryState(doc.expiry_date) === filters.certificationStatus,
        );
        if (!hasStatus) return null;
      }

      if (filters.yearsOfService && yearOfService !== filters.yearsOfService)
        return null;

      if (
        filters.performanceRating &&
        performance.rating.toLowerCase() !==
        filters.performanceRating.toLowerCase()
      )
        return null;

      return { ...info, rating: performance.rating };
    })
    .filter(Boolean);

  // ---------- PAGINATION ----------
  const totalItems = filteredTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);
  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* ADD TEACHER BUTTON */}


      {/* FILTERS */}
      <Filters
        dataCount={filteredTeachers.length.toString()}
        filters={filters}
        onSearchChange={setSearch}
        onViewChange={setGridView}
        onFilterChange={(type, value) =>
          setFilters((prev) => ({ ...prev, [type]: value }))
        }
      />
      <Dialog>
        <DialogTrigger asChild>
          <button className="mb-6 rounded-xl bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 ">
            Add Teacher
          </button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"> <DialogHeader> <DialogTitle className="flex items-center gap-3 text-xl"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600"> <i className="fas fa-user-plus text-white"></i> </div> Add New Teacher </DialogTitle> <DialogDescription className="text-slate-500"> Register a new faculty member to the system. </DialogDescription> </DialogHeader> <AddTeacherForm /> </DialogContent>
      </Dialog>

      {selectedTeachersId.length > 0 && (
        <BulkActions
          teacherIds={selectedTeachersId}
          onClear={() => setSelectedTeachers([])}
          onDeleteSuccess={(ids) =>
            setSelectedTeachers((prev) => prev.filter((id) => !ids.includes(id)))
          }
        />
      )}

      {/* TEACHERS GRID */}


      <div
        className={
          gridView === "grid"
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-3"
        }
      >
        {paginatedTeachers.length > 0 ? (
          paginatedTeachers.map(
            (value, index) =>
              value && (
                <TeacherCard
                  key={index}
                  info={value}
                  isSelected={selectedTeachersId.includes(value.user)}
                  onTeacherSelect={(id, checked) =>
                    setSelectedTeachers((prev) =>
                      checked ? [...prev, id] : prev.filter((x) => x !== id),
                    )
                  }
                />
              ),
          )
        ) : (
          <div className="col-span-full text-center py-16 text-slate-500">
            No teachers found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between bg-white p-4 rounded-xl border">
        {/* Showing text */}
        <p className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(endIndex, totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-semibold">{totalItems}</span> teachers
        </p>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="h-9 w-9 rounded-lg border hover:bg-slate-50 disabled:opacity-50"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-lg font-medium ${currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}

          {/* Next */}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="h-9 w-9 rounded-lg border hover:bg-slate-50 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </main>
  );
};

export default TeacherDirectoryPage;

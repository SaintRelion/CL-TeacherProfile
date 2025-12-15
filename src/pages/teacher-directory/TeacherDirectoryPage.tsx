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
import { getYearsOfService } from "@/lib/utils";
import type { TeacherPerformance } from "@/models/Performance";
import { type PersonalInformation } from "@/models/PersonalInformation";
import type { User } from "@/models/User";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
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
    emailAddress: "",
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
  const { useSelect: selectUsers } = useDBOperationsLocked<User>("User");
  const { useSelect: selectTeachersInformation } =
    useDBOperationsLocked<PersonalInformation>("PersonalInformation");
  const { useSelect: selectTeacherPerformance } =
    useDBOperationsLocked<TeacherPerformance>("TeacherPerformance");

  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({
    department: "",
    certificationStatus: "",
    yearsOfService: "",
    performanceRating: "",
  });

  const { data: users } = selectUsers();
  const { data: teachersInformation } = selectTeachersInformation();
  const { data: teacherPerformances } = selectTeacherPerformance();

  const filteredTeachers = users
    ?.map((user) => {
      const teacherInformation =
        teachersInformation?.find((ti) => ti.userId == user.id) ??
        createFallbackTeacher(user);

      if (teacherInformation.photoBase64 == "")
        teacherInformation.photoBase64 = NO_FACE_IMAGE;

      const teacherPerformance = teacherPerformances?.find(
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
      if (
        filters.department &&
        department !== filters.department.toLowerCase().replaceAll("-", " ")
      )
        return null;

      if (
        filters.performanceRating &&
        teacherPerformance.rating.toLowerCase() !==
          filters.performanceRating.toLowerCase()
      )
        return null;

      if (
        filters.yearsOfService &&
        yearOfService !==
          filters.yearsOfService.toLowerCase().replaceAll("-", " ")
      )
        return null;

      // if (
      //   filters.certificationStatus &&
      //   status !== filters.certificationStatus.toLowerCase().replaceAll("-", " ")
      // )
      //   return false;

      return {
        ...teacherInformation,
        rating: teacherPerformance.rating,
      };
    })
    .filter(Boolean);

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
            <DialogTrigger asChild>
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
        dataCount={
          filteredTeachers != null ? filteredTeachers.length.toString() : "0"
        }
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTeachers != null
          ? filteredTeachers.map((value, index) => (
              <TeacherCard
                key={index}
                info={value}
                isSelected={
                  selectedTeachers.indexOf(value?.employeeId ?? "") != -1
                }
                onTeacherSelect={(employeeID, checked) => {
                  setSelectedTeachers(
                    (prev) =>
                      checked
                        ? [...prev, employeeID] // Add ID when checked
                        : prev.filter((id) => id !== employeeID), // Remove ID when unchecked
                  );
                }}
              />
            ))
          : "No teachers found"}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-secondary-600 text-sm">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">20</span> of{" "}
          <span className="font-medium">
            {filteredTeachers != null ? filteredTeachers.length : 0}
          </span>{" "}
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

import NotFound from "./pages/NotFound";

import {
  registerGroupAppRoutes,
  createAppRouter,
  createRoleLayout,
} from "@saintrelion/routers";
import TeacherProfilePage from "./pages/teacher-profile/TeacherProfilePage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TeacherDirectoryPage from "./pages/teacher-directory/TeacherDirectoryPage";
import DocumentRepositoryPage from "./pages/document-repository/DocumentRepositoryPage";
import TeacherProfileInspectPage from "./pages/teacher-profile-inspect/TeacherProfileInspectPage";
import { roleLayoutMap } from "@saintrelion/auth-lib";
import { PublicLayout } from "./layout/PublicLayout";
import AdminLayout from "./layout/AdminLayout";
import InstructorLayout from "./layout/InstructorLayout";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import LandingPage from "./pages/authentication/LandingPage";

roleLayoutMap[""] = {
  redirect: "/",
  layout: PublicLayout,
};
registerGroupAppRoutes({
  path: "/",
  layout: createRoleLayout(""),
  errorElement: <NotFound />,
  children: [
    { path: "login", auth: true, element: <LandingPage /> },
    {
      path: "forgot",
      auth: true,
      element: <ForgotPasswordPage />,
    },
    {
      path: "reset-password",
      public: true,
      element: <ResetPasswordPage />,
    },
  ],
});

roleLayoutMap["admin"] = {
  redirect: "/admin",
  layout: AdminLayout,
};
registerGroupAppRoutes({
  path: "/admin",
  layout: createRoleLayout("admin"),
  errorElement: <NotFound />,
  children: [
    {
      index: true,
      element: <DashboardPage />,
      label: "Dashboard",
      iconClassName: "fas fa-tachometer-alt",
      allowedRoles: ["admin"],
    },
    {
      path: "teacherdirectory",
      element: <TeacherDirectoryPage />,
      label: "Teacher Profile",
      iconClassName: "fas fa-users",
      allowedRoles: ["admin"],
    },
    {
      path: "documentrepository",
      element: <DocumentRepositoryPage />,
      label: "Document Repository",
      iconClassName: "fas fa-folder-open",
      allowedRoles: ["admin"],
    },
    {
      path: "teacherprofileinspect",
      element: <TeacherProfileInspectPage />,
      allowedRoles: ["admin"],
    },
  ],
});

roleLayoutMap["instructor"] = {
  redirect: "/instructor",
  layout: InstructorLayout,
};

registerGroupAppRoutes({
  path: "/instructor",
  layout: createRoleLayout("instructor"),
  errorElement: <NotFound />,
  children: [
    {
      index: true,
      element: <TeacherProfilePage />,
      // label: "Teacher Profile",
      // iconClassName: "fas fa-user-edit"
      allowedRoles: ["instructor"],
    },
  ],
});

// ✅ Create router
export const router = createAppRouter();

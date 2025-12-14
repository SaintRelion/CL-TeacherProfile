import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/authentication/LoginPage";

import { ProtectedRoute } from "@saintrelion/auth-lib";
import { registerGroupAppRoutes, createAppRouter } from "@saintrelion/routers";
import TeacherProfilePage from "./pages/teacher-profile/TeacherProfilePage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TeacherDirectoryPage from "./pages/teacher-directory/TeacherDirectoryPage";
import DocumentRepositoryPage from "./pages/document-repository/DocumentRepositoryPage";
// ✅ Register protected routes (with layout)
registerGroupAppRoutes({
  layout: (
    <ProtectedRoute>
      <RootLayout />
    </ProtectedRoute>
  ),
  path: "/",
  errorElement: <NotFound />,
  children: [
    // PUBLIC
    { path: "/login", public: true, element: <LoginPage /> },
    { path: "/forgot", public: true, element: <ForgotPasswordPage /> },
    // RESITRICTED
    {
      index: true,
      path: "/admin/",
      element: <DashboardPage />,
      label: "Dashboard",
      iconClassName: "fas fa-tachometer-alt",
      allowedRoles: ["admin"],
    },
    {
      path: "/teacherdirectory",
      element: <TeacherDirectoryPage />,
      label: "Teacher Directory",
      iconClassName: "fas fa-users",
      allowedRoles: ["admin"],
    },
    {
      path: "/documentrepository",
      element: <DocumentRepositoryPage />,
      label: "Document Repository",
      iconClassName: "fas fa-folder-open",
      allowedRoles: ["admin"],
    },

    // Instructor
    {
      index: true,
      path: "/",
      element: <TeacherProfilePage />,
      // label: "Teacher Profile",
      // iconClassName: "fas fa-user-edit"
      allowedRoles: ["instructor"],
    },
  ],
});

// ✅ Create router
export const router = createAppRouter();

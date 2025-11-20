import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/authentication/LoginPage";

import { ProtectedRoute } from "@saintrelion/auth-lib";
import {
  registerGroupAppRoutes,
  registerAppRoute,
  createAppRouter,
} from "@saintrelion/routers";
import TeacherProfilePage from "./pages/teacher-profile/TeacherProfilePage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TeacherDirectoryPage from "./pages/teacher-directory/TeacherDirectoryPage";
import DocumentRepositoryPage from "./pages/document-repository/DocumentRepositoryPage";
// ✅ Register protected routes (with layout)
registerGroupAppRoutes({
  layout: (
    // <ProtectedRoute>
    <RootLayout />
    // </ProtectedRoute>
  ),
  path: "/",
  errorElement: <NotFound />,
  children: [
    {
      index: true,
      path: "/",
      element: <DashboardPage />,
      label: "Dashboard",
      iconClassName: "fas fa-tachometer-alt",
      // allowedRoles: ["admin"],
    },
    {
      index: true,
      path: "/teacherdirectory",
      element: <TeacherDirectoryPage />,
      label: "Teacher Directory",
      iconClassName: "fas fa-users",
      // allowedRoles: ["admin"],
    },
    {
      index: true,
      path: "/documentrepository",
      element: <DocumentRepositoryPage />,
      label: "Document Repository",
      iconClassName: "fas fa-folder-open",
      // allowedRoles: ["admin"],
    },
    {
      path: "/teacherprofile",
      element: <TeacherProfilePage />,
      // label: "Teacher Profile",
      // iconClassName: "fas fa-user-edit"
      // allowedRoles: ["admin"],
    },
  ],
});

// ✅ Public routes
registerAppRoute({ path: "/login", element: <LoginPage /> });
registerAppRoute({ path: "/forgot", element: <ForgotPasswordPage /> });

// ✅ Create router
export const router = createAppRouter();

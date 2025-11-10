import { TeacherProfileTabs } from "./components/TeacherProfileTabs";
import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/authentication/LoginPage";

import { ProtectedRoute } from "@saintrelion/auth-lib";
import {
  registerGroupAppRoutes,
  registerAppRoute,
  createAppRouter,
} from "@saintrelion/routers";
import TeacherProfile from "./pages/teacher-profile/teacher-profile";
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
      element: <TeacherProfile />,
      label: "Teach Profile",
      // allowedRoles: ["admin"],
    },
  ],
});

// ✅ Public routes
registerAppRoute({ path: "/login", element: <LoginPage /> });

// ✅ Create router
export const router = createAppRouter();

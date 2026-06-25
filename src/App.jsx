import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { ROLES, ROUTES } from "@/utils/constants";
import { getDashboardPath } from "@/utils/roleUtils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Login from "@/pages/auth/Login";
import Profile from "@/pages/common/Profile";
import NotFound from "@/pages/common/Notfound";
import AdminDashboard from "@/pages/admin/AdminDashBoard";
import TrainerDashboard from "@/pages/trainer/TrainerDashBoard";
import Unauthorized from "@/pages/common/Unauthorized";
import BranchList from "@/pages/admin/BranchList";
import AdminUsers from "@/pages/admin/AdminUsers";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ManagerUsers from "@/pages/manager/ManagerUsers";
import ManagerAttendance from "@/pages/manager/ManagerAttendance";
import TrainerAttendance from "@/pages/trainer/TrainerAttendance";
import WorkoutPlans from "@/pages/trainer/WorkoutPlans";
import WorkoutTasks from "@/pages/trainer/WorkoutTasks";
import MemberDashboard from "@/pages/member/MemberDashboard";
import MyTasks from "@/pages/member/MyTasks";
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import WhyJoinUs from "@/pages/public/WhyJoinUs";
import Plans from "@/pages/public/Plans";
import Coaches from "@/pages/public/Coaches";
import Visit from "@/pages/public/Visit";
import { PublicLayout } from "@/components/layout/PublicLayout";
import TrainerUsers from "@/pages/trainer/TrainerUsers";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/why-join" element={<WhyJoinUs />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/visit" element={<Visit />} />
      </Route>

      <Route
        path={ROUTES.LOGIN}
        element={
          user ? (
            <Navigate to={getDashboardPath(user.role)} replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.PROFILE} element={<Profile />} />

        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_BRANCHES}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <BranchList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path={ROUTES.MANAGER_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MANAGER_USERS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <ManagerUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MANAGER_PLANS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.TRAINER]}>
              <WorkoutPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MANAGER_ATTENDANCE}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <ManagerAttendance />
            </ProtectedRoute>
          }
        />

        {/* Trainer */}
        <Route
          path={ROUTES.TRAINER_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRAINER_USERS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
              <TrainerUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRAINER_PLANS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
              <WorkoutPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRAINER_TASKS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
              <WorkoutTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRAINER_ATTENDANCE}
          element={
            <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
              <TrainerAttendance />
            </ProtectedRoute>
          }
        />

        {/* Member */}
        <Route
          path={ROUTES.MEMBER_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEMBER_TASKS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

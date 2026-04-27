import { Routes, Route, Navigate } from "react-router-dom";

// Guards
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { GymRoute } from "./GymRoute";

// Layouts
import { Layout } from "../layout/Layout";
import { AuthLayout } from "../layout/AuthLayout";
import { AdminLayout } from "../layout/AdminLayout";

// Auth pages
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { VerifyOtpPage } from "../pages/auth/OtpVeriffyPage";
import { ResetPasswordPage } from "../pages/auth/ResetPaswordPage";

// Gym pages
import { CreateGymPage } from "../pages/gym/CreateGymPage";
import { GymPage } from "../pages/gym/GymPage";
import { GymSettingsPage } from "../pages/gym/GymSettingsPage";

// App pages
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { EquipmentPage } from "../pages/equipment/EquipmentPage";
import { EquipmentDetailPage } from "../pages/equipment/EquipmentDetailPage";
import { MaintenancePage } from "../pages/maintenance/MaintenancePage";
import { CategoryPage } from "../pages/category/CategoryPage";
 
// Admin pages
import { AdminPage } from "../pages/admin/AdminPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminGymsPage } from "../pages/admin/AdminGymsPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";

// Not found and Unauthorized pages
import { NotFoundPage } from "../pages/NotFoundPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";




export function AppRouter() {
   return( 
    <Routes>

      {/* Route redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />}/>

      {/* Public auth routes */}
      <Route
        path="/register"
        element={
           <AuthLayout title="Create account" subtitle="Start managing your gym today">
             <RegisterPage />
           </AuthLayout>
          }
        />
       <Route 
         path="/login"
         element={
             <AuthLayout>
                <LoginPage />
             </AuthLayout>
          }
         />
        <Route 
          path="/forgot-password"
          element={
            <AuthLayout>
                <ForgotPasswordPage />
            </AuthLayout>
          }
         />
        <Route
          path="/verify-otp"
          element={
            <AuthLayout>
                <VerifyOtpPage />
            </AuthLayout>
          } 
         />
        <Route 
          path="/reset-password"
          element={
             <AuthLayout>
                <ResetPasswordPage />
             </AuthLayout>
          }
         />
        
        {/* Protected authenticated users only*/}
        <Route element={<ProtectedRoute />}>
          
          {/* Gym creation auth but no gym yet*/}
          <Route path="/gym/create" element={<CreateGymPage />}/>

          {/* Gym scoped routes requires gymId or Admin */}
          <Route element={<GymRoute />}>
            
            {/* App pages vith standard layout */}
            <Route
              path="/dashboard"
              element={<Layout><DashboardPage /></Layout>}
             />
            <Route
              path="/equipment"
              element={<Layout><EquipmentPage /></Layout>}
             />
            <Route
              path="/equipment/:id"
              element={<Layout><EquipmentDetailPage /></Layout>}
             />
            <Route
              path="/maintenance"
              element={<Layout><MaintenancePage /></Layout>}
             />
            <Route
              path="/categories"
              element={<Layout><CategoryPage /></Layout>}
             />
            <Route
              path="/gym"
              element={<Layout><GymPage /></Layout>}
             />

            {/* Gym settings OWNER + ADMIN only  */}
            <Route element={<RoleRoute allowedRoles={["OWNER", "ADMIN"]} />}>
               <Route 
                 path="/gym/settings"
                 element={<Layout><GymSettingsPage /></Layout>}
                 />
            </Route>

            {/* Admin routes per ADMIN ONLY */}
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
               <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>} />
               <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
               <Route path="/admin/gyms" element={<AdminLayout><AdminGymsPage /></AdminLayout>} />
               <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
            </Route>

          </Route>
        </Route>
      
    </Routes>
   )
} 
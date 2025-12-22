import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ManagerLayout from "../layouts/ManagerLayout";

// Pages
import HomePage from "../pages/HomePage";
import MyProfilePage from "../pages/MyProfilePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import UILibraryPage from "../pages/UILibraryPage";
import EmployeesPage from "../pages/EmployeesPage";
import ManagerPage from "../pages/ManagerPage";
import PayrollPage from "../pages/PayrollPage";
import ActionsPage from "../pages/ActionsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        {/* Rutas privadas con layout - Empleados */}
        <Route element={<MainLayout />}>
          <Route path="/my-profile" element={<MyProfilePage />} />
        </Route>
        {/* Rutas de Administrador y RH */}

        <Route element={<ManagerLayout />}>
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/manager/employees" element={<EmployeesPage />} />
          <Route path="/manager/payroll" element={<PayrollPage />} />
          <Route path="/manager/actions" element={<ActionsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Test */}
        <Route path="/ui" element={<UILibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

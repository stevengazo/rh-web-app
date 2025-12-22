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
import EmployeesPage from '../pages/EmployeesPage';

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
          <Route path="/manager/*" element={<div>Manager Area</div>} />
          <Route path="/manager/employees" element={<EmployeesPage />} />
      
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

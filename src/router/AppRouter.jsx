import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ManagerLayout from '../layouts/ManagerLayout';

// Pages
import HomePage from '../pages/HomePage';
import MyProfilePage from '../pages/MyProfilePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage';
import UILibraryPage from '../pages/UILibraryPage';
import EmployeesPage from '../pages/EmployeesPage';
import ManagerPage from '../pages/ManagerPage';
import PayrollPage from '../pages/PayrollPage';
import ActionsPage from '../pages/ActionsPage';
import ViewEmployeePage from '../pages/ViewEmployeePage';
import SettingsPage from '../pages/SettingsPage';
import NewPayrollPage from '../pages/NewPayrollPage';
import KPIPage from '../pages/KPIPage';
import MyKPIs from '../pages/MyKPIs';
import MyCommissionsPage from '../pages/MyComissionsPage';
import MyPayrollsPage from '../pages/MyPayrollsPage';
import QuestionPage from '../pages/QuestionPage';
import ViewPerformancePage from '../pages/ViewPerformancePage';
import LoansPage from '../pages/LoansPage';
import ViewLoanPage from '../pages/ViewLoanPage';
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
          <Route path="/my-kpis" element={<MyKPIs />} />
          <Route path="/my-comissions" element={<MyCommissionsPage />} />
          <Route path="/my-payrolls" element={<MyPayrollsPage />} />
        </Route>
        {/* Rutas de Administrador y RH */}

        <Route element={<ManagerLayout />}>
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/manager/employees" element={<EmployeesPage />} />
          <Route path="/manager/payroll" element={<PayrollPage />} />
          <Route path="/manager/actions" element={<ActionsPage />} />
          <Route path="/manager/kpis" element={<KPIPage />} />
           <Route path="/manager/loans" element={<LoansPage />} /> 
          <Route path="/manager/questions" element={<QuestionPage />} />
          <Route path="/manager/employees/:id" element={<ViewEmployeePage />} />
          <Route
            path="/manager/perfornance/:id"
            element={<ViewPerformancePage />}
          />

            <Route
            path="/manager/loan/:id"
            element={<ViewLoanPage />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payroll/new/:id" element={<NewPayrollPage />} />
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

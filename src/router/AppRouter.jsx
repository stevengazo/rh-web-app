import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

// Pages
import HomePage from "../pages/HomePage"
import MyProfilePage from "../pages/MyProfilePage"
import LoginPage from "../pages/LoginPage"
import NotFoundPage from "../pages/NotFoundPage"
import RegisterPage from "../pages/RegisterPage"
import UILibraryPage from "../pages/UILibraryPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        

        {/* Rutas privadas con layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />


        {/* Test */}
        <Route path="/ui-library" element={<UILibraryPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

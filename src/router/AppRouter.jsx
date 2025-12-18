import { BrowserRouter, Routes, Route } from "react-router-dom"
//Pages
import LoginPage from "../pages/LoginPage"
import NotFoundPage from "../pages/NotFoundPage"
import TestAnimation from "../test/TestAnimation"
import HomePage from '../pages/HomePage'
// Layout
import  MainLayout  from "../layouts/MainLayout"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestAnimation />} />

        {/* Rutas con layout */}
        <Route element={<MainLayout />}>
          {/* aquí van las rutas privadas */}
                <Route path="/" element={<HomePage />} />
                </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

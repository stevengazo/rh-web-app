import { BrowserRouter, Routes, Route } from "react-router-dom"

// Pages
import LoginPage from "../pages/LoginPage"
import NotFoundPage from "../pages/NotFoundPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

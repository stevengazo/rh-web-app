import { Outlet } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, Users, LogOut } from "lucide-react"

const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-gray-900 text-white p-4"
      >
        <h2 className="text-xl font-bold mb-6">Sistema RH</h2>

        <nav className="space-y-3">
          <a className="flex items-center gap-2 text-gray-300 hover:text-white">
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a className="flex items-center gap-2 text-gray-300 hover:text-white">
            <Users size={20} />
            Empleados
          </a>
        </nav>

        <button className="mt-10 flex items-center gap-2 text-red-400 hover:text-red-500">
          <LogOut size={18} />
          Salir
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        dafafaf
        <Outlet />
      </main>

    </div>
  )
}


export default MainLayout
import { motion } from "framer-motion"
import {
  Users,
  UserPlus,
  CalendarCheck,
  BarChart3
} from "lucide-react"

const cards = [
  {
    title: "Empleados",
    value: "128",
    icon: Users,
    color: "text-indigo-600",
  },
  {
    title: "Nuevos ingresos",
    value: "5",
    icon: UserPlus,
    color: "text-emerald-600",
  },
  {
    title: "Asistencias",
    value: "96%",
    icon: CalendarCheck,
    color: "text-blue-600",
  },
  {
    title: "Reportes",
    value: "12",
    icon: BarChart3,
    color: "text-purple-600",
  },
]

const ManagerPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Panel de Gestión
        </h1>
        <p className="text-sm text-gray-500">
          Resumen general del sistema
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {card.value}
                </h3>
              </div>

              <div className={`${card.color}`}>
                <Icon size={32} />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ManagerPage

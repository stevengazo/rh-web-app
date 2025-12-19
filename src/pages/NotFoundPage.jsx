import { motion } from "framer-motion"
import { Ghost, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6 text-indigo-600"
        >
          <Ghost size={64} />
        </motion.div>

        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <h3 className="text-lg text-gray-500 mb-6">
          Página no encontrada
        </h3>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </button>
      </motion.div>

    </div>
  )
}

export default NotFoundPage

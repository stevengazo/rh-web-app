import { AlertTriangle } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />

      <h1 className="text-3xl font-bold mb-2">404</h1>
      <h3 className="text-lg mb-6">Página no encontrada</h3>

      <a
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Volver al inicio
      </a>
    </div>
  )
}

export default NotFoundPage

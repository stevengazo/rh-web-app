import { Phone, User, Users, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const ContactsEmergencyTable = ({ items = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <User size={16} /> Nombre
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <Phone size={16} /> Teléfono
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <Users size={16} /> Relación
              </div>
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold text-white">
              Acciones
            </th>
          </tr>
        </thead>

        <motion.tbody className="divide-y">
          {items.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No hay contactos de emergencia registrados
              </td>
            </tr>
          )}

          {items.map((item) => (
            <tr key={item.contactEmergencyId} className="text-sm">
              <td className="px-4 py-3 font-medium text-gray-800">
                {item.name || '-'}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {item.phone || '-'}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {item.relationship || '-'}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(item)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete?.(item)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  )
}

export default ContactsEmergencyTable

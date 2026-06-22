import { Phone, User, Users, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import IconButton from '../IconButton';

const ContactsEmergencyTable = ({ items = [], onEdit, onDelete }) => {
  return (
    <div className="mx-auto w-full max-w-6xl border-collapse rounded-xl overflow-hidden shadow">
      <table className="w-full border border-stroke-soft rounded-md">
        <thead className="bg-surface-alt">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <User size={16} /> Nombre
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <Phone size={16} /> Teléfono
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <Users size={16} /> Relación
              </div>
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold text-ink-secondary">
              Acciones
            </th>
          </tr>
        </thead>

        <motion.tbody className="divide-y">
          {items.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-ink-muted"
              >
                No hay contactos de emergencia registrados
              </td>
            </tr>
          )}

          {items.map((item) => (
            <tr key={item.contactEmergencyId} className="text-sm">
              <td className="px-4 py-3 font-medium text-ink">
                {item.name || '-'}
              </td>

              <td className="px-4 py-3 text-ink-muted">{item.phone || '-'}</td>

              <td className="px-4 py-3 text-ink-muted">
                {item.relationship || '-'}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <IconButton
                    icon={Pencil}
                    onClick={() => onEdit?.(item)}
                    variant="primary"
                    size={16}
                    title="Editar"
                  />

                  <IconButton
                    icon={Trash2}
                    onClick={() => onDelete?.(item)}
                    variant="danger"
                    size={16}
                    title="Eliminar"
                  />
                </div>
              </td>
            </tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default ContactsEmergencyTable;

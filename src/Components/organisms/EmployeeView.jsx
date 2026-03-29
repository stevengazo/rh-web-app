import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Building2 } from 'lucide-react';

const EmployeeView = ({ employee }) => {
  const navigate = useNavigate();

  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`;

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
          {initials}
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-800">
            {employee.firstName} {employee.lastName}
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              employee.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {employee.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Info */}
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-slate-400" />
          {employee.email}
        </div>

        {employee.phoneNumber && (
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-slate-400" />
            {employee.phoneNumber}
          </div>
        )}

        {employee?.departament?.name && (
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-slate-400" />
            {employee.departament.name}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 flex gap-3">
        <button
          onClick={() => navigate(`/manager/employees/${employee.id}`)}
          className="flex-1 text-sm font-medium bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition"
        >
          Ver perfil completo
        </button>
      </div>
    </div>
  );
};

export default EmployeeView;

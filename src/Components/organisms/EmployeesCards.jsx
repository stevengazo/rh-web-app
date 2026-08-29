import { Mail, Phone, Building2, ChevronRight, Users } from 'lucide-react';
import EmployeeView from './EmployeeView';
import EmployeeAvatar from '../molecules/EmployeeAvatar';
import { useEmployeePhotos } from '../../hooks/useEmployeePhotos';

const EmployeesCards = ({ employees = [], HandleShowEdit }) => {
  // Una sola petición para las fotos de toda la lista
  const { fotos } = useEmployeePhotos();

  if (!employees.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
        <Users size={32} />
        <p className="text-sm">No se encontraron empleados.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {employees.map((emp) => {
        const foto = fotos[emp.id];

        return (
          <div
            key={emp.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              HandleShowEdit('Ver Empleado', <EmployeeView employee={emp} fotoUrl={foto} />)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                HandleShowEdit('Ver Empleado', <EmployeeView employee={emp} fotoUrl={foto} />);
              }
            }}
            className="group cursor-pointer overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-sm
              transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
          >
            {/* Header con avatar */}
            <div className="flex items-start justify-between gap-3 p-5 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <EmployeeAvatar employee={emp} src={foto} size="md" />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  {emp?.departament?.name && (
                    <p className="truncate text-xs text-ink-muted">
                      {emp.departament.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Estado: punto + texto */}
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  emp.isActive
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    emp.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                {emp.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-2 border-t border-stroke-soft px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Mail size={15} className="shrink-0" />
                <span className="truncate">{emp.email}</span>
              </div>

              {emp.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <Phone size={15} className="shrink-0" />
                  <span className="truncate">{emp.phoneNumber}</span>
                </div>
              )}

              {emp?.departament?.name && (
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <Building2 size={15} className="shrink-0" />
                  <span className="truncate">{emp.departament.name}</span>
                </div>
              )}
            </div>

            {/* Footer affordance */}
            <div className="flex items-center justify-end border-t border-stroke-soft px-5 py-2.5">
              <span className="flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Ver detalle
                <ChevronRight size={14} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeesCards;

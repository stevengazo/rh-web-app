import { useNavigate } from 'react-router-dom';
import { Brain, Eye } from 'lucide-react';

import RowActionButton from '../../molecules/RowActionButton';
import PsychometricStatusBadge from '../../molecules/PsychometricStatusBadge';
import { estadoDeAplicacion } from '../../../utils/psychometricStatus';

const formatFecha = (v) => {
  if (!v || String(v).startsWith('0001-01-01')) return '—';
  const f = new Date(v);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Evaluaciones psicométricas del colaborador dentro de su expediente.
 * Vista de consulta: la gestión y los resultados viven en `/manager/psicometria`.
 */
const EmployeePsychometricsPanel = ({ assignments = [] }) => {
  const navigate = useNavigate();

  if (!assignments.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl
                      border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted">
        <Brain size={26} />
        <p className="text-sm">Este colaborador no tiene evaluaciones psicométricas.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Prueba</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Asignada</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Completada</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Ver</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
          {assignments.map((a) => (
            <tr
              key={a.psychometricAssignmentId}
              onClick={() =>
                navigate(`/manager/psicometria/aplicacion/${a.psychometricAssignmentId}`)
              }
              className="cursor-pointer transition-colors hover:bg-canvas"
            >
              <td className="px-4 py-3 font-medium text-ink">{a.testName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                {formatFecha(a.assignedAt)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                {formatFecha(a.completedAt)}
              </td>
              <td className="px-4 py-3">
                <PsychometricStatusBadge value={estadoDeAplicacion(a)} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <RowActionButton
                    icon={Eye}
                    label="Ver aplicación"
                    tono="brand"
                    onClick={() =>
                      navigate(
                        `/manager/psicometria/aplicacion/${a.psychometricAssignmentId}`
                      )
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeePsychometricsPanel;

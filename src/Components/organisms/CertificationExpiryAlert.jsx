import { AlertTriangle } from 'lucide-react';

import {
  DIAS_AVISO,
  certificacionesPorAtender,
  textoVigencia,
} from '../../utils/certificaciones';

/**
 * Aviso de certificaciones vencidas o próximas a vencer.
 *
 * El modelo ya guardaba `expirationDate`, pero nadie lo miraba: una
 * certificación podía caducar sin que la organización se enterara.
 *
 * @param {Array} certifications
 * @param {(c: object) => void} [onVer]
 */
const CertificationExpiryAlert = ({ certifications = [], onVer }) => {
  const pendientes = certificacionesPorAtender(certifications);
  if (pendientes.length === 0) return null;

  const vencidas = pendientes.filter((p) => p.estado === 'vencida').length;
  const urgente = vencidas > 0;

  return (
    <div
      className={`rounded-xl border p-4 ${
        urgente
          ? 'border-red-200 bg-red-50'
          : 'border-amber-200 bg-amber-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={18}
          className={`mt-0.5 shrink-0 ${urgente ? 'text-red-600' : 'text-amber-700'}`}
        />

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold ${
              urgente ? 'text-red-700' : 'text-amber-900'
            }`}
          >
            {vencidas > 0
              ? `${vencidas} ${vencidas === 1 ? 'certificación vencida' : 'certificaciones vencidas'}`
              : `Certificaciones por vencer en los próximos ${DIAS_AVISO} días`}
          </p>

          <ul className="mt-2 space-y-1">
            {pendientes.map(({ certificacion, estado, dias }) => (
              <li
                key={certificacion.certificationId ?? certificacion.name}
                className="flex flex-wrap items-baseline gap-x-2 text-sm"
              >
                <button
                  type="button"
                  onClick={() => onVer?.(certificacion)}
                  disabled={!onVer}
                  className={`font-medium underline-offset-2 ${
                    onVer ? 'hover:underline' : 'cursor-default'
                  } ${urgente ? 'text-red-700' : 'text-amber-900'}`}
                >
                  {certificacion.name}
                </button>

                <span
                  className={`text-xs ${
                    estado === 'vencida' ? 'text-red-600' : 'text-amber-800'
                  }`}
                >
                  {textoVigencia({ estado, dias })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificationExpiryAlert;

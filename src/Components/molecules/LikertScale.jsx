import { LIKERT_LABELS } from '../../utils/psychometricStatus';

/**
 * Escala Likert de 1 a 5 para responder un ítem.
 *
 * @param {string} name       Identificador del grupo de radios (el ítem).
 * @param {number|null} value  Valor elegido (1..5).
 * @param {(v:number)=>void} onChange
 * @param {boolean} [disabled]
 */
const LikertScale = ({ name, value, onChange, disabled = false }) => (
  <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label={name}>
    {LIKERT_LABELS.map((label, i) => {
      const v = i + 1;
      const activo = value === v;

      return (
        <label
          key={v}
          className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-2 text-center
                      transition-colors
                      ${
                        activo
                          ? 'border-brand bg-brand-tint text-brand-700'
                          : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand/40'
                      }
                      ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={v}
            checked={activo}
            disabled={disabled}
            onChange={() => onChange?.(v)}
            className="sr-only"
          />
          <span
            className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold
                        ${activo ? 'bg-brand text-white' : 'bg-surface-alt text-ink-secondary'}`}
          >
            {v}
          </span>
          <span className="text-[11px] leading-tight">{label}</span>
        </label>
      );
    })}
  </div>
);

export default LikertScale;

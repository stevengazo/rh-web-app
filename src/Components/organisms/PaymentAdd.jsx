import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import paymentApi from '../../api/paymentsApi';
import { useAppContext } from '../../context/AppContext';
import { formatMoney } from '../../utils/formatMoney';
import { mensajeDeError } from '../../utils/apiError';
import Label from '../Label';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const soloFecha = (valor) => {
  if (!valor) return new Date().toISOString().split('T')[0];
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? new Date().toISOString().split('T')[0]
    : f.toISOString().split('T')[0];
};

/**
 * Registro o edición de un abono a un préstamo.
 *
 * @param {number} loanId
 * @param {number} [saldo]  Saldo pendiente; limita el monto y permite el atajo "abonar todo".
 * @param {number} [cuota]  Cuota mensual sugerida.
 * @param {Object} [payment] Si se pasa, el formulario edita ese abono en vez de crear uno.
 * @param {() => void} [onAdded]
 * @param {() => void} [onCancel]
 */
const PaymentAdd = ({ loanId = 0, saldo, cuota, payment, onAdded, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';

  const esEdicion = Boolean(payment);

  // Al editar, el propio abono ya está descontado del saldo: se suma de vuelta
  // para saber cuánto se puede poner como monto.
  const saldoDisponible =
    saldo === undefined
      ? undefined
      : saldo + (esEdicion ? Number(payment.amount) || 0 : 0);

  const [fecha, setFecha] = useState(
    esEdicion ? soloFecha(payment.createdDate) : today
  );
  const [monto, setMonto] = useState(() => {
    if (esEdicion) return String(Number(payment.amount ?? 0).toFixed(2));
    return cuota && saldo ? String(Math.min(cuota, saldo).toFixed(2)) : '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const montoNumero = Number(monto) || 0;
  const excede =
    saldoDisponible !== undefined && montoNumero > saldoDisponible + 0.01;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (montoNumero <= 0) {
      setError('El monto debe ser mayor a cero.');
      return;
    }

    if (excede) {
      setError(
        `El abono no puede superar el saldo pendiente (${formatMoney(saldoDisponible)}).`
      );
      return;
    }

    try {
      setLoading(true);

      if (esEdicion) {
        await paymentApi.updatePayment(payment.paymentId, {
          amount: montoNumero,
          createdDate: fecha,
          editedBy: quien,
        });
        toast.success('Abono actualizado');
      } else {
        await paymentApi.createPayment({
          amount: montoNumero,
          createdDate: fecha,
          createdBy: quien,
          createdAt: new Date().toISOString(),
          editedBy: quien,
          editedAt: new Date().toISOString(),
          deleted: false,
          loanId: Number(loanId),
        });
        toast.success('Abono registrado');
        setMonto('');
      }

      onAdded?.();
    } catch (err) {
      console.error(err);
      const mensaje = mensajeDeError(
        err,
        esEdicion
          ? 'No se pudo actualizar el abono.'
          : 'No se pudo registrar el abono.'
      );
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar abono' : 'Registrar abono'}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          El abono se descuenta del saldo del préstamo.
        </p>
      </div>

      {/* Contexto económico */}
      {saldoDisponible !== undefined && (
        <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">
              {esEdicion ? 'Saldo disponible' : 'Saldo pendiente'}
            </span>
            <span className="font-bold text-ink">
              {formatMoney(saldoDisponible)}
            </span>
          </div>

          {cuota > 0 && (
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Cuota mensual</span>
              <span className="font-medium text-ink-secondary">
                {formatMoney(cuota)}
              </span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {cuota > 0 && cuota <= saldoDisponible && (
              <button
                type="button"
                onClick={() => setMonto(String(cuota.toFixed(2)))}
                className="rounded-md border border-stroke bg-surface px-2.5 py-1 text-xs font-semibold
                           text-ink-secondary transition-colors hover:border-brand hover:text-brand"
              >
                Una cuota
              </button>
            )}

            <button
              type="button"
              onClick={() => setMonto(String(saldoDisponible.toFixed(2)))}
              className="rounded-md border border-stroke bg-surface px-2.5 py-1 text-xs font-semibold
                         text-ink-secondary transition-colors hover:border-brand hover:text-brand"
            >
              Cancelar el saldo
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="pago-fecha">Fecha del abono</Label>
        <DateInput
          id="pago-fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="pago-monto">Monto *</Label>
        <TextInput
          id="pago-monto"
          type="number"
          min="0"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          error={excede}
          placeholder="0.00"
          required
        />

        {excede && (
          <p className="mt-1 text-xs font-medium text-red-600">
            Supera el saldo pendiente de {formatMoney(saldoDisponible)}.
          </p>
        )}

        {!excede && montoNumero > 0 && saldoDisponible !== undefined && (
          <p className="mt-1 text-xs text-ink-muted">
            Quedaría un saldo de {formatMoney(saldoDisponible - montoNumero)}
            {saldoDisponible - montoNumero <= 0.01
              ? ' — el préstamo quedará saldado.'
              : '.'}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onCancel && (
          <SecondaryButton onClick={onCancel} disabled={loading}>
            Cancelar
          </SecondaryButton>
        )}

        <PrimaryButton
          type="submit"
          disabled={
            loading ||
            (!esEdicion && !loanId) ||
            excede ||
            montoNumero <= 0
          }
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Guardando…
            </>
          ) : esEdicion ? (
            'Guardar cambios'
          ) : (
            'Guardar abono'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default PaymentAdd;

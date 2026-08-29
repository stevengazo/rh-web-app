import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Settings,
  Sparkles,
  StopCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import {
  configIa,
  estadoIa,
  modeloPara,
  pedirTexto,
} from '../../api/iaClient';
import { buscarModelo } from '../../data/modelosIa';

/**
 * Panel de una tarea asistida por IA.
 *
 * Es el mismo para todas: un botón que genera, el texto resultante y las
 * acciones para copiarlo o aplicarlo. Las pantallas solo aportan de qué va la
 * tarea y con qué datos.
 *
 * El texto **nunca se aplica solo**: se muestra y quien decide es la persona.
 * Un modelo puede equivocarse con un monto o inventar un dato del expediente,
 * y esto es información laboral.
 *
 * @param {string} uso           Id de `USO`.
 * @param {string} titulo
 * @param {string} descripcion
 * @param {() => string} construirPrompt  Se llama al generar, no antes: así
 *        siempre usa los datos que hay en pantalla en ese momento.
 * @param {string} sistema       Instrucción de rol para el modelo.
 * @param {(texto: string) => void} [onAplicar]  Si viene, aparece "Aplicar".
 * @param {string} [textoAplicar]
 */
const AiAssistPanel = ({
  uso,
  titulo,
  descripcion,
  construirPrompt,
  sistema,
  onAplicar,
  textoAplicar = 'Aplicar',
  maxTokens = 1200,
}) => {
  const [texto, setTexto] = useState('');
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);
  const abortRef = useRef(null);

  const estado = estadoIa();
  const config = configIa();
  const modeloId = modeloPara(uso);
  const modelo = buscarModelo(config.proveedor, modeloId);

  const generar = useCallback(async () => {
    setGenerando(true);
    setError('');
    setTexto('');

    const controlador = new AbortController();
    abortRef.current = controlador;

    try {
      const resultado = await pedirTexto({
        uso,
        sistema,
        prompt: construirPrompt(),
        maxTokens,
        signal: controlador.signal,
      });

      setTexto(resultado);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError(err.message || 'No se pudo generar el texto.');
    } finally {
      setGenerando(false);
      abortRef.current = null;
    }
  }, [uso, sistema, construirPrompt, maxTokens]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error('El navegador no permitió copiar.');
    }
  };

  /* Sin configuración no se ofrece el botón: sería un callejón sin salida. */
  if (!estado.listo) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-stroke bg-surface-alt p-4">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-ink-muted" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{titulo}</p>
          <p className="mt-1 text-xs text-ink-muted">{estado.motivo}</p>

          <Link
            to="/settings"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <Settings size={12} />
            Ir a Configuración
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles size={15} className="text-brand" />
            {titulo}
          </h3>
          <p className="mt-0.5 text-xs text-ink-muted">{descripcion}</p>
        </div>

        {generando ? (
          <SecondaryButton onClick={() => abortRef.current?.abort()}>
            <StopCircle size={15} />
            Detener
          </SecondaryButton>
        ) : (
          <PrimaryButton onClick={generar}>
            {texto ? <RefreshCw size={15} /> : <Sparkles size={15} />}
            {texto ? 'Volver a generar' : 'Generar'}
          </PrimaryButton>
        )}
      </div>

      {generando && (
        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-xs text-ink-muted">
            <Loader2 size={13} className="animate-spin" />
            Consultando a {modelo?.nombre ?? modeloId}…
          </p>
          {[100, 92, 96, 60].map((ancho, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded bg-stroke-soft"
              style={{ width: `${ancho}%` }}
            />
          ))}
        </div>
      )}

      {error && !generando && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {texto && !generando && (
        <div className="mt-4 space-y-3">
          <div className="whitespace-pre-wrap rounded-lg border border-stroke-soft bg-surface p-4 text-sm leading-relaxed text-ink">
            {texto}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-ink-muted">
              Generado por {modelo?.nombre ?? modeloId}.{' '}
              <span className="font-semibold">Revísalo antes de usarlo:</span>{' '}
              puede equivocarse.
            </p>

            <div className="flex gap-2">
              <SecondaryButton onClick={copiar}>
                {copiado ? <Check size={15} /> : <Copy size={15} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </SecondaryButton>

              {onAplicar && (
                <PrimaryButton onClick={() => onAplicar(texto)}>
                  {textoAplicar}
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AiAssistPanel;

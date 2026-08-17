import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import CtaButton from '../../molecules/marketing/CtaButton';
import { CONTACTO } from '../../../data/marketing';

/**
 * Formulario de solicitud de demostración.
 *
 * TODO(backend): la API todavía no expone un endpoint de prospectos.
 * Cuando exista (por ejemplo `POST /api/Leads`), reemplaza `enviarSolicitud`
 * por la llamada real; el resto del componente ya contempla los estados de
 * envío, éxito y error.
 */

/* Campo de formulario a escala de marketing (los primitivos del sistema
   interno miden 32 px de alto, muy densos para esta página). */
const campoBase = `w-full rounded-md border border-stroke border-b-2 border-b-ink-muted
  bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted
  transition-colors duration-150 focus:outline-none focus:border-b-brand`;

const Campo = ({ id, label, requerido = false, children }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-semibold text-ink-secondary"
    >
      {label}
      {requerido && (
        <span className="ml-0.5 text-red-600" aria-hidden="true">
          *
        </span>
      )}
    </label>
    {children}
  </div>
);

const TAMANOS = [
  '1 a 25 colaboradores',
  '26 a 100 colaboradores',
  '101 a 300 colaboradores',
  'Más de 300 colaboradores',
];

const inicial = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  tamano: '',
  mensaje: '',
};

const ContactForm = () => {
  const [datos, setDatos] = useState(inicial);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const actualizar = (campo) => (e) =>
    setDatos((prev) => ({ ...prev, [campo]: e.target.value }));

  /** Sustituir por la llamada real a la API cuando exista el endpoint. */
  const enviarSolicitud = (payload) =>
    new Promise((resolve) => setTimeout(() => resolve(payload), 700));

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await enviarSolicitud(datos);
      setEnviado(true);
      toast.success('Solicitud enviada. Te contactamos pronto.');
    } catch {
      toast.error('No pudimos enviar la solicitud. Escríbenos por correo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="rounded-xl border border-stroke-soft bg-surface p-8 text-center shadow-sm">
        <CheckCircle2
          size={44}
          className="mx-auto text-brand"
          strokeWidth={1.6}
        />

        <h3 className="mt-4 text-xl font-bold text-ink">
          Recibimos tu solicitud
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          Gracias, {datos.nombre.split(' ')[0] || 'de nuevo'}. Te escribiremos a{' '}
          <span className="font-semibold text-ink">{datos.email}</span> dentro
          del siguiente día hábil para coordinar la demostración.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton to="/caracteristicas" variant="secondary" size="md">
            Ver características
          </CtaButton>

          <button
            type="button"
            onClick={() => {
              setDatos(inicial);
              setEnviado(false);
            }}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id="nombre" label="Nombre completo" requerido>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            value={datos.nombre}
            onChange={actualizar('nombre')}
            placeholder="Ana Rodríguez"
            className={campoBase}
          />
        </Campo>

        <Campo id="empresa" label="Empresa" requerido>
          <input
            id="empresa"
            name="empresa"
            type="text"
            required
            autoComplete="organization"
            value={datos.empresa}
            onChange={actualizar('empresa')}
            placeholder="Nombre de tu empresa"
            className={campoBase}
          />
        </Campo>

        <Campo id="email" label="Correo electrónico" requerido>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={datos.email}
            onChange={actualizar('email')}
            placeholder="nombre@empresa.com"
            className={campoBase}
          />
        </Campo>

        <Campo id="telefono" label="Teléfono">
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={datos.telefono}
            onChange={actualizar('telefono')}
            placeholder="8888-8888"
            className={campoBase}
          />
        </Campo>

        <div className="sm:col-span-2">
          <Campo id="tamano" label="Cantidad de colaboradores" requerido>
            <select
              id="tamano"
              name="tamano"
              required
              value={datos.tamano}
              onChange={actualizar('tamano')}
              className={`${campoBase} cursor-pointer`}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {TAMANOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <div className="sm:col-span-2">
          <Campo id="mensaje" label="¿Qué necesitas resolver?">
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              value={datos.mensaje}
              onChange={actualizar('mensaje')}
              placeholder="Cuéntanos cómo llevas hoy la planilla y qué te gustaría mejorar."
              className={`${campoBase} resize-y`}
            />
          </Campo>
        </div>
      </div>

      <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-muted">
          También puedes escribirnos a{' '}
          <a
            href={`mailto:${CONTACTO.email}`}
            className="font-semibold text-brand hover:underline"
          >
            {CONTACTO.email}
          </a>
        </p>

        <CtaButton
          type="submit"
          size="lg"
          disabled={enviando}
          className="w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
        >
          {enviando ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Send size={18} />
              Solicitar demostración
            </>
          )}
        </CtaButton>
      </div>
    </form>
  );
};

export default ContactForm;

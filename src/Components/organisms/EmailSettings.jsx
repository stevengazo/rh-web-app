import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, Mail, RefreshCw, Send, XCircle } from 'lucide-react';

import emailSettingsApi from '../../api/emailSettingsApi';
import { useAppContext } from '../../context/AppContext';
import { mensajeDeError } from '../../utils/apiError';

import PageTitle from '../PageTitle';
import Divider from '../Divider';
import Label from '../Label';
import TextInput from '../TextInput';
import CheckBoxInput from '../CheckBoxInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Configuración del correo de salida (SMTP): lo que usa el sistema para enviar
 * correos de prueba, recordatorios y las acciones de automatización.
 */
const EmailSettings = () => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';

  const [form, setForm] = useState({
    enabled: false,
    smtpServer: '',
    port: 587,
    senderName: '',
    senderEmail: '',
    username: '',
    useSsl: true,
  });
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordNueva, setPasswordNueva] = useState('');
  const [meta, setMeta] = useState({ source: null, updatedAt: null, updatedBy: null });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [probando, setProbando] = useState(false);
  const [correoPrueba, setCorreoPrueba] = useState('');
  const [resultadoPrueba, setResultadoPrueba] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const { data } = await emailSettingsApi.get();
      setForm({
        enabled: data.enabled ?? false,
        smtpServer: data.smtpServer ?? '',
        port: data.port ?? 587,
        senderName: data.senderName ?? '',
        senderEmail: data.senderEmail ?? '',
        username: data.username ?? '',
        useSsl: data.useSsl ?? true,
      });
      setHasPassword(Boolean(data.hasPassword));
      setPasswordNueva('');
      setMeta({
        source: data.source,
        updatedAt: data.updatedAt,
        updatedBy: data.updatedBy,
      });
      setCorreoPrueba((c) => c || data.senderEmail || '');
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo cargar la configuración de correo.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const guardar = async () => {
    if (form.enabled) {
      if (!form.smtpServer.trim()) return toast.error('Indica el servidor SMTP.');
      if (!form.senderEmail.includes('@')) return toast.error('El correo del remitente no es válido.');
    }

    setGuardando(true);
    try {
      await emailSettingsApi.update({
        ...form,
        port: Number(form.port) || 587,
        // null = no tocar; el usuario solo la manda si escribió algo.
        password: passwordNueva ? passwordNueva : null,
        savedBy: quien,
      });
      toast.success('Configuración de correo guardada.');
      cargar();
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo guardar.'));
    } finally {
      setGuardando(false);
    }
  };

  const probar = async () => {
    if (!correoPrueba.includes('@')) return toast.error('Indica un correo de destino.');
    setProbando(true);
    setResultadoPrueba(null);
    try {
      const { data } = await emailSettingsApi.test(correoPrueba.trim());
      setResultadoPrueba(data);
      if (data.ok) toast.success(data.message);
      else toast.error('El envío de prueba falló.');
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo enviar el correo de prueba.'));
    } finally {
      setProbando(false);
    }
  };

  if (cargando) {
    return <div className="h-72 animate-pulse rounded-xl bg-surface-alt" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PageTitle className="mb-0">Correo de salida</PageTitle>
          </div>
          <p className="text-sm text-ink-muted">
            El servidor SMTP que el sistema usa para enviar correos (pruebas,
            recordatorios y acciones de automatización).
          </p>
          {meta.source === 'appsettings' && (
            <p className="mt-1 text-xs text-amber-700">
              Ahora mismo se usan los valores del despliegue. Guardar aquí los sobrescribe.
            </p>
          )}
          {meta.updatedAt && (
            <p className="mt-1 text-xs text-ink-muted">
              Última actualización: {new Date(meta.updatedAt).toLocaleString('es-CR')}
              {meta.updatedBy ? ` · ${meta.updatedBy}` : ''}
            </p>
          )}
        </div>
        <SecondaryButton onClick={cargar}>
          <RefreshCw size={15} />
          Actualizar
        </SecondaryButton>
      </div>

      <Divider />

      <CheckBoxInput
        label="Enviar correos desde el sistema"
        checked={form.enabled}
        onChange={(e) => set('enabled', e.target.checked)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="es-server">Servidor SMTP</Label>
          <TextInput
            id="es-server"
            value={form.smtpServer}
            onChange={(e) => set('smtpServer', e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </div>

        <div>
          <Label htmlFor="es-port">Puerto</Label>
          <TextInput
            id="es-port"
            type="number"
            min="1"
            max="65535"
            value={form.port}
            onChange={(e) => set('port', e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <CheckBoxInput
            label="Usar SSL/TLS"
            checked={form.useSsl}
            onChange={(e) => set('useSsl', e.target.checked)}
          />
        </div>

        <div>
          <Label htmlFor="es-sname">Nombre del remitente</Label>
          <TextInput
            id="es-sname"
            value={form.senderName}
            onChange={(e) => set('senderName', e.target.value)}
            placeholder="Sistema RH"
          />
        </div>

        <div>
          <Label htmlFor="es-semail">Correo del remitente</Label>
          <TextInput
            id="es-semail"
            type="email"
            value={form.senderEmail}
            onChange={(e) => set('senderEmail', e.target.value)}
            placeholder="rrhh@empresa.com"
          />
        </div>

        <div>
          <Label htmlFor="es-user">Usuario</Label>
          <TextInput
            id="es-user"
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            placeholder="rrhh@empresa.com"
          />
        </div>

        <div>
          <Label htmlFor="es-pass">Contraseña</Label>
          <TextInput
            id="es-pass"
            type="password"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            placeholder={hasPassword ? '•••••••• (guardada)' : 'Contraseña o clave de aplicación'}
          />
          {hasPassword && !passwordNueva && (
            <p className="mt-1 text-xs text-ink-muted">
              Se conserva la actual. Escribe una nueva para cambiarla.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={guardar} disabled={guardando}>
          {guardando ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
          Guardar
        </PrimaryButton>
      </div>

      <Divider />

      {/* Prueba */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Enviar un correo de prueba</p>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-56 flex-1">
            <Label htmlFor="es-test">Para</Label>
            <TextInput
              id="es-test"
              type="email"
              value={correoPrueba}
              onChange={(e) => setCorreoPrueba(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <SecondaryButton onClick={probar} disabled={probando}>
            {probando ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Enviar prueba
          </SecondaryButton>
        </div>

        {resultadoPrueba && (
          <div
            className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-sm ${
              resultadoPrueba.ok
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {resultadoPrueba.ok ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : (
              <XCircle size={16} className="mt-0.5 shrink-0" />
            )}
            <span className="wrap-break-word">{resultadoPrueba.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSettings;

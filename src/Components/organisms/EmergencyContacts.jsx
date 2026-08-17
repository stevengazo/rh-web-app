import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HeartPulse, Loader2, Phone, Plus, Trash2, X } from 'lucide-react';

import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import IconButton from '../IconButton';
import ContactEmergencies from '../../api/contactEmergenciesApi';

const formVacio = { name: '', phone: '', relationship: '' };

/**
 * Contactos de emergencia del colaborador: listar, agregar y eliminar.
 *
 * Gestiona su propia carga porque es una sección autocontenida dentro del
 * perfil; así no obliga a la página a recargar todo por un cambio local.
 *
 * @param {string} userId
 * @param {boolean} [editable] Permite agregar y eliminar (perfil propio).
 */
const EmergencyContacts = ({ userId, editable = true }) => {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(null);

  const cargar = useCallback(async () => {
    if (!userId) {
      setCargando(false);
      return;
    }

    setCargando(true);
    const datos = await ContactEmergencies.getContactEmergenciesByUser(userId);
    setContactos(Array.isArray(datos) ? datos : []);
    setCargando(false);
  }, [userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cancelar = () => {
    setForm(formVacio);
    setMostrarForm(false);
  };

  const agregar = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('El nombre y el teléfono son obligatorios.');
      return;
    }

    setGuardando(true);

    const creado = await ContactEmergencies.createContactEmergency({
      name: form.name.trim(),
      phone: form.phone.trim(),
      relationship: form.relationship.trim() || null,
      userId,
    });

    setGuardando(false);

    if (!creado) {
      toast.error('No se pudo agregar el contacto.');
      return;
    }

    toast.success('Contacto agregado.');
    cancelar();
    cargar();
  };

  const eliminar = async (contacto) => {
    const nombre = contacto.name || 'este contacto';
    if (!window.confirm(`¿Eliminar a ${nombre} de tus contactos de emergencia?`))
      return;

    setEliminando(contacto.contactEmergencyId);

    const ok = await ContactEmergencies.deleteContactEmergency(
      contacto.contactEmergencyId
    );

    setEliminando(null);

    if (!ok) {
      toast.error('No se pudo eliminar el contacto.');
      return;
    }

    toast.success('Contacto eliminado.');
    cargar();
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-ink-secondary">
          <HeartPulse size={18} className="text-brand" />
          Contactos de emergencia
        </h3>

        {editable && !mostrarForm && (
          <PrimaryButton onClick={() => setMostrarForm(true)}>
            <Plus size={16} />
            Agregar
          </PrimaryButton>
        )}
      </div>

      {/* Formulario de alta */}
      {mostrarForm && (
        <form
          onSubmit={agregar}
          className="rounded-xl border border-stroke-soft bg-surface-alt p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Nuevo contacto</p>
            <IconButton
              icon={X}
              onClick={cancelar}
              size={16}
              aria-label="Cancelar"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="ce-name">Nombre *</Label>
              <TextInput
                id="ce-name"
                name="name"
                value={form.name}
                onChange={cambiar}
                placeholder="María Rodríguez"
              />
            </div>

            <div>
              <Label htmlFor="ce-phone">Teléfono *</Label>
              <TextInput
                id="ce-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={cambiar}
                placeholder="8888-8888"
              />
            </div>

            <div>
              <Label htmlFor="ce-rel">Parentesco</Label>
              <TextInput
                id="ce-rel"
                name="relationship"
                value={form.relationship}
                onChange={cambiar}
                placeholder="Madre, cónyuge…"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <SecondaryButton onClick={cancelar} disabled={guardando}>
              Cancelar
            </SecondaryButton>

            <PrimaryButton type="submit" disabled={guardando}>
              {guardando ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando…
                </>
              ) : (
                'Guardar contacto'
              )}
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* Listado */}
      {cargando ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-stroke-soft bg-surface-alt"
            />
          ))}
        </div>
      ) : contactos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-10 text-ink-muted">
          <HeartPulse size={28} />
          <p className="text-sm">No tienes contactos de emergencia.</p>
          <p className="text-xs">
            Registra al menos uno: es a quien llamaríamos ante un imprevisto.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {contactos.map((contacto) => (
            <div
              key={contacto.contactEmergencyId}
              className="flex items-start justify-between gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {contacto.name || 'Sin nombre'}
                </p>

                {contacto.relationship && (
                  <p className="text-xs text-ink-muted">
                    {contacto.relationship}
                  </p>
                )}

                {contacto.phone && (
                  <a
                    href={`tel:${contacto.phone}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                  >
                    <Phone size={14} />
                    {contacto.phone}
                  </a>
                )}
              </div>

              {editable && (
                <IconButton
                  icon={eliminando === contacto.contactEmergencyId ? Loader2 : Trash2}
                  variant="danger"
                  size={16}
                  disabled={eliminando === contacto.contactEmergencyId}
                  onClick={() => eliminar(contacto)}
                  aria-label={`Eliminar a ${contacto.name || 'contacto'}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmergencyContacts;

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Info, Loader2, Save } from 'lucide-react';

import Label from '../Label';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import EmployeeApi from '../../api/employeesApi';

/** Fecha ISO → `yyyy-MM-dd` para el input. Tolera el viejo centinela 0001-01-01. */
const paraInput = (fecha) => {
  if (!fecha || String(fecha).startsWith('0001-01-01')) return '';
  return String(fecha).substring(0, 10);
};

/**
 * Autoedición de los datos personales del colaborador.
 *
 * `PUT /api/Employee/{id}` sobrescribe los campos que recibe, así que el
 * payload reenvía correo y departamento tal cual venían: si se omitieran,
 * el backend los dejaría en null. Dirección y jornada no las toca ese
 * endpoint, por eso no aparecen en el formulario.
 *
 * @param {object} profile   Perfil actual.
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const MyProfileEdit = ({ profile = {}, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    firstName: profile.firstName ?? '',
    middleName: profile.middleName ?? '',
    lastName: profile.lastName ?? '',
    secondLastName: profile.secondLastName ?? '',
    dni: profile.dni ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    birthDate: paraInput(profile.birthDate),
  });

  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('El nombre y el primer apellido son obligatorios.');
      return;
    }

    setGuardando(true);

    try {
      await EmployeeApi.updateEmployee(profile.id, {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim() || null,
        lastName: form.lastName.trim(),
        secondLastName: form.secondLastName.trim() || null,
        dni: form.dni.trim() || null,
        phoneNumber: form.phoneNumber.trim() || null,

        // Se reenvían sin cambios para que el backend no los sobrescriba
        email: profile.email,
        departamentId: profile.departamentId ?? null,

        // La columna ya es nulable: sin fecha se manda null, no el 0001-01-01
        // que antes había que enviar para satisfacer un DateTime obligatorio.
        birthDate: form.birthDate
          ? new Date(`${form.birthDate}T00:00:00`).toISOString()
          : null,
      });

      toast.success('Tus datos se actualizaron correctamente.');
      onSaved?.();
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('No se pudieron guardar los cambios. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">Primer nombre *</Label>
          <TextInput
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={cambiar}
            placeholder="Steven"
          />
        </div>

        <div>
          <Label htmlFor="middleName">Segundo nombre</Label>
          <TextInput
            id="middleName"
            name="middleName"
            value={form.middleName}
            onChange={cambiar}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Primer apellido *</Label>
          <TextInput
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={cambiar}
            placeholder="Gazo"
          />
        </div>

        <div>
          <Label htmlFor="secondLastName">Segundo apellido</Label>
          <TextInput
            id="secondLastName"
            name="secondLastName"
            value={form.secondLastName}
            onChange={cambiar}
          />
        </div>

        <div>
          <Label htmlFor="dni">Cédula</Label>
          <TextInput
            id="dni"
            name="dni"
            value={form.dni}
            onChange={cambiar}
            placeholder="1-1234-5678"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Teléfono</Label>
          <TextInput
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={cambiar}
            placeholder="8888-8888"
          />
        </div>

        <div>
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <DateInput
            id="birthDate"
            name="birthDate"
            value={form.birthDate}
            onChange={cambiar}
          />
        </div>

        <div>
          <Label htmlFor="email">Correo</Label>
          <TextInput id="email" value={profile.email ?? ''} disabled />
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-lg bg-surface-alt p-3 text-xs leading-relaxed text-ink-muted">
        <Info size={14} className="mt-0.5 shrink-0" />
        El correo, el departamento, la jornada y la fecha de ingreso los
        administra Recursos Humanos. Si alguno está mal, avísales.
      </p>

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onCancel && (
          <SecondaryButton onClick={onCancel} disabled={guardando}>
            Cancelar
          </SecondaryButton>
        )}

        <PrimaryButton type="submit" disabled={guardando}>
          {guardando ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save size={16} />
              Guardar cambios
            </>
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default MyProfileEdit;

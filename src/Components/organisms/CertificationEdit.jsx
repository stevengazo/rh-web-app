import { useState } from 'react';
import certificationApi from '../../api/certificationApi';
import toast from 'react-hot-toast';

import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';

const CertificationEdit = ({ item, OnClose }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    certificationId: item?.certificationId,
    name: item?.name || '',
    institution: item?.institution || '',
    emissionDate: item?.emissionDate?.split('T')[0] || '',
    expirationDate: item?.expirationDate?.split('T')[0] || '',
    credentialId: item?.credentialId || '',
    status: item?.status || '',
    description: item?.description || '',
    userId: item.userId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await certificationApi.updateCertification(
        form.certificationId,
        form
      );

      toast.success('Certificación actualizada correctamente');
      OnUpdate?.();

    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la certificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre</Label>
        <TextInput
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Institución</Label>
        <TextInput
          name="institution"
          value={form.institution}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Fecha de emisión</Label>
          <TextInput
            type="date"
            name="emissionDate"
            value={form.emissionDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Fecha de expiración</Label>
          <TextInput
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label>ID Credencial</Label>
        <TextInput
          name="credentialId"
          value={form.credentialId}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Estado</Label>
        <TextInput
          name="status"
          value={form.status}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <TextInput
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={OnClose}
          className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
        >
          Cancelar
        </button>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default CertificationEdit;

import { useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import CertificationApi from '../../api/certificationApi';
import certificationApi from '../../api/certificationApi';

const CertificationAdd = ({ userId, author }) => {
  const today = new Date().toISOString().split('T')[0];

  const notify = () => toast.success('Agregado');

  const [newCertification, setNewCertification] = useState({
    certificationId: 0,
    name: '',
    institution: '',
    emissionDate: today,
    expirationDate: today,
    credentialId: '',
    status: '',
    fileUrl: '',
    description: '',
    createdBy: author?.userName ?? '',
    createdAt: today,
    updatedBy: author?.userName ?? '',
    updatedAt: today,
    isDeleted: false,
    userId: userId,
    appUser: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCertification((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    certificationApi
      .createCertification(newCertification)
      .then((e) => notify())
      .catch((e) => console.error('Error: ' + e));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Agregar certificación
        </h2>
        <p className="text-sm text-gray-500">
          Información básica de la certificación
        </p>
      </div>

      {/* Inputs */}
      <TextInput
        label="Nombre de la certificación"
        name="name"
        value={newCertification.name}
        onChange={handleChange}
        placeholder="AWS Certified Developer"
      />

      <TextInput
        label="Institución"
        name="institution"
        value={newCertification.institution}
        onChange={handleChange}
        placeholder="Amazon, Microsoft, Cisco..."
      />

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Fecha de emisión</label>
          <input
            type="date"
            name="emissionDate"
            value={newCertification.emissionDate}
            onChange={handleChange}
            className="w-full mt-1 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Fecha de expiración</label>
          <input
            type="date"
            name="expirationDate"
            value={newCertification.expirationDate}
            onChange={handleChange}
            className="w-full mt-1 text-sm"
          />
        </div>
      </div>

      <TextInput
        label="Credential ID"
        name="credentialId"
        value={newCertification.credentialId}
        onChange={handleChange}
        placeholder="ABC-123456"
      />

      {/* Estado */}
      <div>
        <label className="text-sm text-gray-600">Estado</label>
        <select
          name="status"
          value={newCertification.status}
          onChange={handleChange}
          className="w-full mt-1 text-sm"
        >
          <option className="text-gray-600" value="">
            Seleccionar
          </option>
          <option className="text-gray-600" value="Vigente">
            Vigente
          </option>
          <option className="text-gray-600" value="Expirada">
            Expirada
          </option>
        </select>
      </div>

      <TextInput
        label="URL del certificado"
        name="fileUrl"
        value={newCertification.fileUrl}
        onChange={handleChange}
        placeholder="https://..."
      />

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-600">Descripción</label>
        <textarea
          name="description"
          value={newCertification.description}
          onChange={handleChange}
          rows={3}
          className="w-full mt-1 text-sm resize-none"
          placeholder="Descripción breve de la certificación"
        />
      </div>

      {/* Acción */}
      <PrimaryButton type="submit" className="w-full">
        Agregar certificación
      </PrimaryButton>
    </form>
  );
};

export default CertificationAdd;

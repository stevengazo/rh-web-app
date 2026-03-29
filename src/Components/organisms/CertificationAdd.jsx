import { useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import certificationApi from '../../api/certificationApi';

const CertificationAdd = ({ userId, author, onAdded }) => {
  const today = new Date().toISOString().split('T')[0];

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
      .then((res) => {
        toast.success('Certificación agregada');
        onAdded();
      })
      .catch((err) => {
        toast.error('Ocurrió un error');
        console.error('Error: ', err);
      });
  };

  const inputStyle =
    'w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Agregar certificación</h2>
        <p className="text-xs text-gray-300 mt-1">Información básica</p>
      </div>

      {/* Nombre */}
      <div>
        <label className="text-sm text-gray-200">
          Nombre de la certificación
        </label>
        <input
          type="text"
          name="name"
          value={newCertification.name}
          onChange={handleChange}
          placeholder="AWS Certified Developer"
          className={inputStyle}
        />
      </div>

      {/* Institución */}
      <div>
        <label className="text-sm text-gray-200">Institución</label>
        <input
          type="text"
          name="institution"
          value={newCertification.institution}
          onChange={handleChange}
          placeholder="Amazon, Microsoft, Cisco..."
          className={inputStyle}
        />
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm text-gray-200">Fecha de emisión</label>
          <input
            type="date"
            name="emissionDate"
            value={newCertification.emissionDate}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        <div>
          <label className="text-sm text-gray-200">Fecha de expiración</label>
          <input
            type="date"
            name="expirationDate"
            value={newCertification.expirationDate}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Credential */}
      <div>
        <label className="text-sm text-gray-200">Credential ID</label>
        <input
          type="text"
          name="credentialId"
          value={newCertification.credentialId}
          onChange={handleChange}
          placeholder="ABC-123456"
          className={inputStyle}
        />
      </div>

      {/* Estado */}
      <div>
        <label className="text-sm text-gray-200">Estado</label>
        <select
          name="status"
          value={newCertification.status}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Seleccionar</option>
          <option value="Vigente">Vigente</option>
          <option value="Expirada">Expirada</option>
        </select>
      </div>

      {/* URL */}
      <div>
        <label className="text-sm text-gray-200">URL del certificado</label>
        <input
          type="text"
          name="fileUrl"
          value={newCertification.fileUrl}
          onChange={handleChange}
          placeholder="https://..."
          className={inputStyle}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-200">Descripción</label>
        <textarea
          name="description"
          value={newCertification.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción breve"
          className={inputStyle + ' resize-none'}
        />
      </div>

      {/* Botón */}
      <PrimaryButton
        type="submit"
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Agregar certificación
      </PrimaryButton>
    </form>
  );
};

export default CertificationAdd;

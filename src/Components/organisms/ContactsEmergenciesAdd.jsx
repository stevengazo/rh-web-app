import { useState } from 'react'
import contactEmergenciesApi from '../../api/contactEmergenciesApi'
import toast from 'react-hot-toast'

const ContactsEmergenciesAdd = ({ userId, onEdited }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await contactEmergenciesApi.createContactEmergency({
        ...formData,
        userId,
      })

      onEdited?.()
      setFormData({ name: '', phone: '', relationship: '' })
      toast.success('Contacto Agregado')
    } catch (error) {
      console.error('Error al guardar contacto de emergencia', error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 text-white"
    >
      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-md bg-transparent border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Teléfono</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-md bg-transparent border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Relación</label>
        <input
          type="text"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className="w-full rounded-md bg-transparent border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-white"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-white text-black py-2 text-sm font-semibold hover:bg-gray-200 transition"
      >
        Guardar contacto
      </button>
    </form>
  )
}

export default ContactsEmergenciesAdd

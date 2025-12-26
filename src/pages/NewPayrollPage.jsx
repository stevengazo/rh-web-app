import { motion } from "framer-motion";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const rowVariants = {
  hover: {
    backgroundColor: "#f8fafc",
    transition: { duration: 0.15 },
  },
};

const NewPayrollPage = () => {
  return (
    <motion.div
      className="w-full space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageTitle>Generar Nueva Planilla</PageTitle>

      {/* Tipo de planilla */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Tipo de planilla
        </label>
        <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Quincenal</option>
          <option>Mensual</option>
        </select>
      </div>

      {/* Tabla */}
      <motion.div
        className="rounded-xl  bg-white shadow-sm"
        variants={containerVariants}
      >
        <SectionTitle>Lista de Empleados</SectionTitle>

        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b text-slate-700">
              {/* Header agrupado */}
              <tr className="text-xs uppercase tracking-wide text-center font-semibold">
                <th colSpan={2} className="bg-blue-100 px-4 py-3">
                  Empleado
                </th>
                <th colSpan={7} className="bg-emerald-100 px-4 py-3">
                  Salario
                </th>
                <th colSpan={7} className="bg-amber-100 px-4 py-3">
                  Tiempo
                </th>
                <th colSpan={3} className="bg-violet-100 px-4 py-3">
                  Bonos
                </th>
              </tr>

              {/* Header principal */}
              <tr className="bg-slate-50 text-xs font-semibold">
                <th className="sticky left-0 z-20 bg-blue-50 px-4 py-3 min-w-[200px] shadow-md">
                  Empleado
                </th>
                <th className="bg-blue-50 px-4 py-3 min-w-[180px]">
                  Departamento
                </th>

                {[
                  "Sal. Mensual",
                  "Sal. Quincenal",
                  "Sal. Diario",
                  "Hora Normal",
                  "Hora Extra",
                  "Hora Doble",
                ].map((h) => (
                  <th
                    key={h}
                    className="bg-emerald-50 px-4 py-3 text-right min-w-[140px]"
                  >
                    {h}
                  </th>
                ))}

                <th className="bg-slate-100 px-4 py-3 min-w-[120px]">
                  Jornada
                </th>

                {[
                  "Días",
                  "Efect.",
                  "Extras",
                  "Dobles",
                  "Feriados",
                ].map((h) => (
                  <th
                    key={h}
                    className="bg-amber-50 px-4 py-3 text-center min-w-[90px]"
                  >
                    {h}
                  </th>
                ))}

                <th className="bg-amber-50 px-4 py-3 text-right min-w-[140px]">
                  ₡ Extras
                </th>
                <th className="bg-amber-50 px-4 py-3 text-right min-w-[140px]">
                  ₡ Dobles
                </th>

                {["Retroactivo", "Bono", "Comisión"].map((h) => (
                  <th
                    key={h}
                    className="bg-violet-50 px-4 py-3 text-right min-w-[140px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <motion.tr
                variants={rowVariants}
                whileHover="hover"
                className="transition"
              >
                <td className="sticky left-0 z-10 bg-white px-4 py-3 border-b font-medium shadow-md">
                  Juan Pérez
                </td>
                <td className="px-4 py-3 border-b">
                  Recursos Humanos
                </td>

                {[
                  "₡800,000",
                  "₡400,000",
                  "₡26,667",
                  "₡3,333",
                  "₡5,000",
                  "₡6,667",
                ].map((v) => (
                  <td key={v} className="px-4 py-3 border-b text-right">
                    {v}
                  </td>
                ))}

                <td className="px-4 py-3 border-b">Diurna</td>

                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <td key={i} className="px-4 py-3 border-b text-center">
                      <input
                        type="number"
                        className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                      />
                    </td>
                  ))}

                <td className="px-4 py-3 border-b text-right font-medium">
                  ₡0
                </td>
                <td className="px-4 py-3 border-b text-right font-medium">
                  ₡0
                </td>

                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <td key={i} className="px-4 py-3 border-b text-right">
                      <input
                        type="number"
                        className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1"
                      />
                    </td>
                  ))}
              </motion.tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Acciones */}
      <motion.div variants={containerVariants}>
        <SectionTitle>Acciones</SectionTitle>
        <div className="flex items-center gap-4">
          <motion.div whileTap={{ scale: 0.97 }}>
            <PrimaryButton>Guardar Planilla</PrimaryButton>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <SecondaryButton>Cancelar</SecondaryButton>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewPayrollPage;

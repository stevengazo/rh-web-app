import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Building2, Crown, Plus, RefreshCw, Users } from 'lucide-react';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import Label from '../Components/Label';
import TextInput from '../Components/TextInput';
import OrgChart from '../Components/organisms/OrgChart';
import DepartamentEdit from '../Components/organisms/DepartamentEdit';
import HelpButton from '../Components/molecules/HelpButton';

import DepartamentApi from '../api/departamentApi';

/** Alta rápida de un departamento. */
const DepartamentAdd = ({ onCreated, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const crear = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }

    setGuardando(true);

    try {
      await DepartamentApi.createDepartament({
        name: nombre.trim(),
        description: descripcion.trim() || null,
        deleted: false,
        parentDepartamentId: null,
        displayOrder: 0,
      });

      toast.success('Departamento creado');
      onCreated?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo crear el departamento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={crear} className="space-y-4">
      <div>
        <Label htmlFor="nuevo-dep">Nombre *</Label>
        <TextInput
          id="nuevo-dep"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Recursos Humanos"
        />
      </div>

      <div>
        <Label htmlFor="nuevo-dep-desc">Descripción</Label>
        <TextInput
          id="nuevo-dep-desc"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <p className="rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
        Se crea en el nivel más alto. Luego, desde el organigrama, puedes
        indicar de qué departamento depende y quién lo dirige.
      </p>

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onClose && (
          <SecondaryButton onClick={onClose} disabled={guardando}>
            Cancelar
          </SecondaryButton>
        )}
        <PrimaryButton type="submit" disabled={guardando}>
          {guardando ? 'Creando…' : 'Crear departamento'}
        </PrimaryButton>
      </div>
    </form>
  );
};

const Indicador = ({ icon: Icon, valor, label, accent }) => (
  <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <span className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </span>
    <div>
      <p className="text-2xl font-semibold leading-none text-ink">{valor}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  </div>
);

const OrgChartPage = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [drawer, setDrawer] = useState(null); // 'editar' | 'crear' | null

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await DepartamentApi.getOrgChart();
      const datos = Array.isArray(res?.data) ? res.data : [];
      setDepartamentos(datos);

      // Mantiene abierto el nodo seleccionado con los datos frescos
      setSeleccionado((actual) =>
        actual
          ? (datos.find((d) => d.departamentId === actual.departamentId) ?? null)
          : null
      );
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar el organigrama');
      setDepartamentos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const totales = useMemo(() => {
    const conJefe = departamentos.filter((d) => (d.chiefs ?? []).length > 0);

    return {
      departamentos: departamentos.length,
      colaboradores: departamentos.reduce(
        (acc, d) => acc + (d.employeeCount ?? 0),
        0
      ),
      jefaturas: departamentos.reduce(
        (acc, d) => acc + (d.chiefs ?? []).length,
        0
      ),
      sinJefe: departamentos.length - conJefe.length,
    };
  }, [departamentos]);

  const abrirDetalle = (nodo) => {
    setSeleccionado(nodo);
    setDrawer('editar');
  };

  return (
    <>
      <OffCanvas
        isOpen={drawer !== null}
        onClose={() => setDrawer(null)}
        title={
          drawer === 'crear'
            ? 'Nuevo departamento'
            : (seleccionado?.name ?? 'Departamento')
        }
      >
        {drawer === 'crear' ? (
          <DepartamentAdd
            onCreated={cargar}
            onClose={() => setDrawer(null)}
          />
        ) : (
          <DepartamentEdit
            departament={seleccionado}
            departamentos={departamentos}
            onSaved={cargar}
            onClose={() => setDrawer(null)}
          />
        )}
      </OffCanvas>

      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SectionTitle className="mb-0">Organigrama</SectionTitle>
            <HelpButton area="organigrama" />
          </div>
          <p className="text-sm text-ink-muted">
            Estructura de departamentos y jefaturas de la empresa.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={cargar} disabled={cargando}>
            <RefreshCw
              size={15}
              className={cargando ? 'animate-spin' : undefined}
            />
            Actualizar
          </SecondaryButton>

          <PrimaryButton onClick={() => setDrawer('crear')}>
            <Plus size={16} />
            Nuevo departamento
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      {/* Indicadores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={Building2}
          valor={totales.departamentos}
          label="Departamentos"
          accent="bg-brand-tint text-brand"
        />
        <Indicador
          icon={Users}
          valor={totales.colaboradores}
          label="Colaboradores activos"
          accent="bg-green-50 text-green-700"
        />
        <Indicador
          icon={Crown}
          valor={totales.jefaturas}
          label="Jefaturas asignadas"
          accent="bg-accent-tint text-accent-strong"
        />
        <Indicador
          icon={Building2}
          valor={totales.sinJefe}
          label="Sin jefatura"
          accent="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Árbol */}
      <div className="mt-6 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
        {cargando ? (
          <div className="flex flex-col items-center gap-6 py-10">
            <div className="h-28 w-60 animate-pulse rounded-xl bg-surface-alt" />
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 w-60 animate-pulse rounded-xl bg-surface-alt"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs text-ink-muted">
              Haz clic en un departamento para editarlo, cambiar de quién
              depende o asignarle jefatura.
            </p>

            <OrgChart
              departamentos={departamentos}
              onSelect={abrirDetalle}
              seleccionadoId={seleccionado?.departamentId}
            />
          </>
        )}
      </div>
    </>
  );
};

export default OrgChartPage;

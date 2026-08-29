import { useCallback, useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Building2, Crown, Maximize2, Users } from 'lucide-react';

/* Medidas del nodo y separación entre niveles. */
const NODE_W = 240;
const NODE_H = 128;
const GAP_X = 36;
const GAP_Y = 80;

/**
 * Convierte la lista plana del endpoint en un árbol.
 *
 * Es tolerante con datos inconsistentes: un departamento cuyo padre no existe
 * se trata como raíz, y si hubiera un ciclo los nodos involucrados se muestran
 * en la raíz en vez de colgar el render.
 *
 * @param {Array} departamentos
 * @returns {{raices: Array, huerfanos: Array}}
 */
export const construirArbol = (departamentos = []) => {
  const porId = new Map();
  departamentos.forEach((d) =>
    porId.set(d.departamentId, { ...d, hijos: [] })
  );

  const raices = [];
  const huerfanos = [];

  porId.forEach((nodo) => {
    const padreId = nodo.parentDepartamentId;

    if (padreId == null) {
      raices.push(nodo);
      return;
    }

    const padre = porId.get(padreId);

    if (!padre) {
      huerfanos.push(nodo);
      raices.push(nodo);
      return;
    }

    // Detección de ciclos: se sube por la cadena de padres.
    let cursor = padre;
    const visitados = new Set([nodo.departamentId]);

    while (cursor) {
      if (visitados.has(cursor.departamentId)) {
        huerfanos.push(nodo);
        raices.push(nodo);
        return;
      }
      visitados.add(cursor.departamentId);
      cursor = porId.get(cursor.parentDepartamentId);
    }

    padre.hijos.push(nodo);
  });

  const ordenar = (nodos) => {
    nodos.sort(
      (a, b) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
        (a.name ?? '').localeCompare(b.name ?? '')
    );
    nodos.forEach((n) => ordenar(n.hijos));
  };

  ordenar(raices);

  return { raices, huerfanos };
};

/**
 * Coloca el árbol en coordenadas: las hojas se reparten de izquierda a derecha
 * y cada padre se centra sobre sus hijos (layout "tidy tree" simplificado).
 *
 * @param {Array} departamentos
 * @returns {{nodes: Array, edges: Array, huerfanos: Array}}
 */
export const calcularLayout = (departamentos = []) => {
  const { raices, huerfanos } = construirArbol(departamentos);

  const nodes = [];
  const edges = [];
  let cursorX = 0;

  const colocar = (nodo, profundidad) => {
    const hijos = nodo.hijos ?? [];

    let x;

    if (hijos.length === 0) {
      x = cursorX;
      cursorX += NODE_W + GAP_X;
    } else {
      const posiciones = hijos.map((h) => colocar(h, profundidad + 1));
      x = (posiciones[0] + posiciones[posiciones.length - 1]) / 2;
    }

    nodes.push({
      id: String(nodo.departamentId),
      type: 'departamento',
      position: { x, y: profundidad * (NODE_H + GAP_Y) },
      data: nodo,
      draggable: false,
    });

    hijos.forEach((h) => {
      edges.push({
        id: `e-${nodo.departamentId}-${h.departamentId}`,
        source: String(nodo.departamentId),
        target: String(h.departamentId),
        type: 'smoothstep',
        style: { stroke: 'var(--color-stroke)', strokeWidth: 1.5 },
      });
    });

    return x;
  };

  raices.forEach((raiz) => {
    colocar(raiz, 0);
    cursorX += GAP_X * 2; // aire entre árboles independientes
  });

  return { nodes, edges, huerfanos };
};

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin nombre';

/** Nodo del diagrama: la tarjeta de un departamento. */
const DepartamentoNode = ({ data, selected }) => {
  const jefes = data.chiefs ?? [];

  return (
    <div
      style={{ width: NODE_W }}
      className={`rounded-xl border bg-surface p-4 shadow-sm transition-all
        ${selected ? 'border-brand ring-2 ring-brand' : 'border-stroke-soft hover:border-brand hover:shadow-md'}`}
    >
      {/* Conectores hacia el padre y hacia los hijos */}
      <Handle
        type="target"
        position={Position.Top}
        className="h-1.5! w-1.5! border-0! bg-stroke!"
      />

      <div className="flex items-start gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-linear-to-br from-brand to-accent text-white">
          <Building2 size={17} />
        </span>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-ink">{data.name}</p>
          <p className="flex items-center gap-1 text-xs text-ink-muted">
            <Users size={12} />
            {data.employeeCount ?? 0} colaborador
            {data.employeeCount === 1 ? '' : 'es'}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-stroke-soft pt-2.5 text-left">
        {jefes.length === 0 ? (
          <p className="text-xs italic text-ink-disabled">
            Sin jefatura asignada
          </p>
        ) : (
          <ul className="space-y-1">
            {jefes.slice(0, 2).map((jefe) => (
              <li
                key={jefe.chief_By_DepartamentId}
                className="flex items-center gap-1.5 text-xs text-ink-secondary"
              >
                <Crown size={12} className="shrink-0 text-accent" />
                <span className="truncate">{nombreDe(jefe.user)}</span>
              </li>
            ))}
            {jefes.length > 2 && (
              <li className="text-xs text-ink-muted">
                +{jefes.length - 2} más
              </li>
            )}
          </ul>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-1.5! w-1.5! border-0! bg-stroke!"
      />
    </div>
  );
};

const nodeTypes = { departamento: DepartamentoNode };

/** Contenido del diagrama. Vive dentro del provider para poder usar `useReactFlow`. */
const OrgChartInner = ({ departamentos = [], onSelect, seleccionadoId }) => {
  const { nodes: nodosCalculados, edges: aristas, huerfanos } = useMemo(
    () => calcularLayout(departamentos),
    [departamentos]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(nodosCalculados);
  const [edges, setEdges, onEdgesChange] = useEdgesState(aristas);
  const { fitView } = useReactFlow();

  // Rehacer el diagrama cuando cambian los datos o la selección
  useEffect(() => {
    setNodes(
      nodosCalculados.map((n) => ({
        ...n,
        selected: String(seleccionadoId) === n.id,
      }))
    );
    setEdges(aristas);
  }, [nodosCalculados, aristas, seleccionadoId, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_evento, nodo) => onSelect?.(nodo.data),
    [onSelect]
  );

  if (departamentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
        <Building2 size={30} />
        <p className="text-sm font-medium">Todavía no hay departamentos</p>
        <p className="text-xs">Crea el primero para empezar el organigrama.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {huerfanos.length > 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {huerfanos.length} departamento
          {huerfanos.length === 1 ? '' : 's'} se muestra
          {huerfanos.length === 1 ? '' : 'n'} en la raíz porque su dependencia
          apunta a un departamento inexistente o forma un ciclo.
        </p>
      )}

      {/* Se queda con el alto que dejó libre el resumen, sin pasarse de la
          pantalla en portátiles: el organigrama es el contenido principal. */}
      <div className="h-[min(72vh,760px)] min-h-[420px] overflow-hidden rounded-xl border border-stroke-soft bg-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          nodesConnectable={false}
          proOptions={{ hideAttribution: false }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1}
            color="var(--color-stroke-soft)"
          />

          <Controls
            showInteractive={false}
            className="border! border-stroke-soft! bg-surface! shadow-sm!"
          />

          <MiniMap
            pannable
            zoomable
            className="border! border-stroke-soft! bg-surface!"
            nodeColor="var(--color-brand)"
            maskColor="rgb(0 0 0 / 0.08)"
          />

          <Panel position="top-right">
            <button
              type="button"
              onClick={() => fitView({ padding: 0.2, duration: 300 })}
              className="inline-flex items-center gap-1.5 rounded-md border border-stroke-soft
                         bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink-secondary shadow-sm
                         transition-colors hover:border-brand hover:text-brand"
            >
              <Maximize2 size={13} />
              Ajustar a la vista
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

/**
 * Organigrama interactivo (React Flow): zoom, desplazamiento, minimapa y
 * ajuste automático a la vista.
 *
 * @param {Array} departamentos  Respuesta de `/departaments/orgchart`.
 * @param {(nodo: object) => void} [onSelect]
 * @param {number} [seleccionadoId]
 */
const OrgChart = (props) => (
  <ReactFlowProvider>
    <OrgChartInner {...props} />
  </ReactFlowProvider>
);

export default OrgChart;

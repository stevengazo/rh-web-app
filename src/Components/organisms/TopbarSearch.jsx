import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Loader2 } from 'lucide-react';

import EmployeeApi from '../../api/employeesApi';
import payrollApi from '../../api/payrollApi';

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('es-CR') : '—');

const TopbarSearch = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const containerRef = useRef(null);

  // Carga perezosa: trae empleados y planillas la primera vez que se enfoca
  const ensureData = async () => {
    if (loaded || loading) return;
    setLoading(true);
    try {
      const [empRes, payRes] = await Promise.all([
        EmployeeApi.getAllEmployees(),
        payrollApi.getAllPayrolls(),
      ]);
      setEmployees(Array.isArray(empRes?.data) ? empRes.data : []);
      setPayrolls(Array.isArray(payRes?.data) ? payRes.data : []);
      setLoaded(true);
    } catch (error) {
      console.error('Error cargando búsqueda', error);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar el panel al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const term = query.trim().toLowerCase();

  const empResults = useMemo(() => {
    if (!term) return [];
    return employees
      .filter((e) =>
        `${e.firstName ?? ''} ${e.lastName ?? ''} ${e.email ?? ''}`
          .toLowerCase()
          .includes(term)
      )
      .slice(0, 5);
  }, [employees, term]);

  const payResults = useMemo(() => {
    if (!term) return [];
    return payrolls
      .filter((p) =>
        `${p.payrollId ?? ''} ${p.payrollType ?? ''} ${p.payrollDescription ?? ''}`
          .toLowerCase()
          .includes(term)
      )
      .slice(0, 5);
  }, [payrolls, term]);

  const hasResults = empResults.length > 0 || payResults.length > 0;

  const go = (path) => {
    setOpen(false);
    setQuery('');
    navigate(path);
  };

  const clear = () => {
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          ensureData();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Buscar empleados o planillas…"
        className="h-9 w-full rounded-md border border-stroke bg-surface pl-9 pr-9 text-sm text-ink
          placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-canvas hover:text-ink"
          title="Limpiar"
        >
          <X size={14} />
        </button>
      )}

      {/* Panel de resultados */}
      {open && term && (
        <div className="absolute left-0 right-0 top-11 z-50 max-h-[70vh] overflow-y-auto rounded-lg border border-stroke-soft bg-surface shadow-xl scrollbar-slim">
          {loading && !loaded ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink-muted">
              <Loader2 size={16} className="animate-spin" />
              Cargando…
            </div>
          ) : !hasResults ? (
            <div className="py-6 text-center text-sm text-ink-muted">
              Sin resultados para “{query}”.
            </div>
          ) : (
            <div className="py-2">
              {/* Empleados */}
              {empResults.length > 0 && (
                <div>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Empleados
                  </p>
                  {empResults.map((e) => (
                    <button
                      key={`emp-${e.id}`}
                      type="button"
                      onClick={() => go(`/manager/employees/${e.id}`)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-canvas"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-semibold text-brand">
                        {`${e.firstName?.[0] ?? ''}${e.lastName?.[0] ?? ''}`.toUpperCase() ||
                          '—'}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">
                          {e.firstName} {e.lastName}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {e.email}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Planillas */}
              {payResults.length > 0 && (
                <div>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Planillas
                  </p>
                  {payResults.map((p) => (
                    <button
                      key={`pay-${p.payrollId}`}
                      type="button"
                      onClick={() => go(`/manager/payroll/${p.payrollId}`)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-canvas"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
                        <FileText size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">
                          Planilla #{p.payrollId}
                          {p.payrollType ? ` · ${p.payrollType}` : ''}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {formatDate(p.initialDate)} – {formatDate(p.finalDate)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopbarSearch;

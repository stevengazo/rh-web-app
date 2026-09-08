import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, LogOut, Search } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { myCompaniesRequest } from '../api/authApi';
import Logo from '../Components/Logo';

const inicialesDe = (nombre) =>
  (nombre || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

/**
 * Selector de empresa — como el selector de portal de Bitrix24: una cuenta
 * puede pertenecer a más de una empresa (varios "espacios de trabajo").
 *
 * Sirve para dos casos, con la misma pantalla: justo después del login (la
 * lista viaja en `pendingCompanies`, ya en memoria) y para cambiar de
 * empresa con la sesión ya iniciada — o tras refrescar la página en pleno
 * selector, que es el mismo caso sin `pendingCompanies` en memoria. Como el
 * token vive en una cookie httpOnly invisible para JavaScript, la única
 * forma de saber qué empresas hay para elegir es pedírselas al servidor.
 */
const SelectCompanyPage = () => {
  const navigate = useNavigate();
  const { pendingCompanies, beginCompanySelection, selectCompany, logout } =
    useAppContext();

  const [companies, setCompanies] = useState(pendingCompanies);
  const [cargando, setCargando] = useState(!pendingCompanies);
  const [entrando, setEntrando] = useState(null);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (pendingCompanies) {
      setCompanies(pendingCompanies);
      setCargando(false);
      return;
    }

    myCompaniesRequest()
      .then(({ data }) => {
        if (!Array.isArray(data) || data.length === 0) {
          navigate('/login', { replace: true });
          return;
        }
        beginCompanySelection(data);
        setCompanies(data);
      })
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setCargando(false));
    // Solo debe correr una vez, al montar: es la recuperación tras refrescar
    // (o la entrada directa a la página para cambiar de empresa).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lista = companies || [];
  const visibles = lista.filter(
    (c) =>
      !busqueda.trim() ||
      (c.name || '').toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const entrar = async (companyId) => {
    setError('');
    setEntrando(companyId);
    try {
      await selectCompany(companyId);
      navigate('/my-profile');
    } catch (err) {
      console.error(err);
      setError('No se pudo entrar a esa empresa.');
      setEntrando(null);
    }
  };

  const salir = () => {
    logout();
    navigate('/login');
  };

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stroke border-t-brand" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="h-1.5 w-full bg-linear-to-r from-brand to-accent" />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 flex justify-center">
            <Logo sobre="claro" size={40} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-stroke-soft bg-surface shadow-lg">
            <div className="border-b border-stroke-soft px-6 pb-4 pt-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
                <Building2 size={20} />
              </div>
              <h1 className="text-lg font-semibold text-ink">
                Elegí tu empresa
              </h1>
              <p className="mt-1 text-sm text-ink-muted">
                Tu cuenta tiene acceso a {lista.length}{' '}
                {lista.length === 1 ? 'empresa' : 'empresas'}
              </p>
            </div>

            {lista.length > 5 && (
              <div className="px-4 pt-4">
                <div className="relative">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar empresa…"
                    className="h-9 w-full rounded-md border border-stroke bg-surface pl-8 pr-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="px-6 pt-4 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <ul className="max-h-96 overflow-y-auto p-2">
              {visibles.map((c) => (
                <li key={c.companyId}>
                  <button
                    type="button"
                    disabled={entrando !== null}
                    onClick={() => entrar(c.companyId)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-canvas disabled:opacity-60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand to-accent text-sm font-semibold text-white">
                      {inicialesDe(c.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {c.name}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {c.role}
                      </span>
                    </span>
                    {entrando === c.companyId ? (
                      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-stroke border-t-brand" />
                    ) : (
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-ink-muted"
                      />
                    )}
                  </button>
                </li>
              ))}

              {visibles.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ink-muted">
                  Sin coincidencias.
                </li>
              )}
            </ul>

            <div className="border-t border-stroke-soft px-6 py-3">
              <button
                type="button"
                onClick={salir}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                <LogOut size={13} />
                Usar otra cuenta
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectCompanyPage;

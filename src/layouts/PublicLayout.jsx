import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicNavBar from '../Components/organisms/marketing/PublicNavBar';
import PublicFooter from '../Components/organisms/marketing/PublicFooter';

/**
 * Shell del sitio público (marketing): barra de navegación + contenido + pie.
 *
 * Al navegar sube al inicio; si la URL trae `#ancla`, hace scroll a esa
 * sección compensando la altura de la barra fija.
 */
const PublicLayout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const destino = document.getElementById(hash.slice(1));
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <PublicNavBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';
import useUserPreferences from './hooks/useUserPreferences';

/** Carga y aplica la personalización del colaborador al entrar. Sin UI. */
function PreferencesLoader() {
  useUserPreferences();
  return null;
}

function App() {
  return (
    <>
      <PreferencesLoader />
      <Toaster position="top-left" reverseOrder={false} />
      <AppRouter />
    </>
  );
}

export default App;

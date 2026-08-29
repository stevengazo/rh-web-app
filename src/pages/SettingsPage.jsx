import { useState } from 'react';
import { Palette, Plug, Shield, Sparkles, Webhook } from 'lucide-react';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import Tabs from '../Components/molecules/Tabs';
import ThemeSettings from '../Components/organisms/ThemeSettings';
import AiSettings from '../Components/organisms/AiSettings';
import WebhookSettings from '../Components/organisms/WebhookSettings';
import McpSettings from '../Components/organisms/McpSettings';
import RolesSettings from '../Components/organisms/RolesSettings';

const TABS = {
  APARIENCIA: 'apariencia',
  IA: 'ia',
  WEBHOOKS: 'webhooks',
  MCP: 'mcp',
  ROLES: 'roles',
};

const CONTENIDO = {
  [TABS.APARIENCIA]: ThemeSettings,
  [TABS.IA]: AiSettings,
  [TABS.WEBHOOKS]: WebhookSettings,
  [TABS.MCP]: McpSettings,
  [TABS.ROLES]: RolesSettings,
};

/**
 * Configuración del sistema.
 *
 * La página estaba vacía: solo tenía el título. Ahora agrupa por pestañas lo
 * que cada persona puede ajustar por su cuenta.
 */
const SettingsPage = () => {
  const [tab, setTab] = useState(TABS.APARIENCIA);

  return (
    <>
      <div>
        <PageTitle className="mb-0">Configuración</PageTitle>
        <p className="text-sm text-ink-muted">
          Apariencia, integraciones con el exterior y permisos.
        </p>
      </div>

      <Divider />

      <Tabs
        idGrupo="ajustes"
        value={tab}
        onChange={setTab}
        items={[
          { id: TABS.APARIENCIA, label: 'Apariencia', icon: Palette },
          { id: TABS.IA, label: 'Inteligencia artificial', icon: Sparkles },
          { id: TABS.WEBHOOKS, label: 'Webhooks', icon: Webhook },
          { id: TABS.MCP, label: 'MCP', icon: Plug },
          { id: TABS.ROLES, label: 'Roles y permisos', icon: Shield },
        ]}
      />

      <div className="mt-6">{(() => {
        const Panel = CONTENIDO[tab] ?? ThemeSettings;
        return <Panel />;
      })()}</div>
    </>
  );
};

export default SettingsPage;

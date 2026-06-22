const ObjetivesTable = ({ objetives }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-stroke-soft">
      <table className="min-w-full divide-y divide-stroke-soft bg-surface">
        <thead className="bg-surface-alt">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft">
          {objetives.map((e) => (
            <tr
              key={e.objetiveId}
              className="hover:bg-canvas transition-colors"
            >
              <td className="px-6 py-4 text-sm text-ink font-medium">
                {e.objetiveId}
              </td>
              <td className="px-6 py-4 text-sm text-ink-secondary">
                {e.category?.name}
              </td>
              <td className="px-6 py-4 text-sm text-ink-secondary">{e.title}</td>
              <td className="px-6 py-4 text-sm text-ink-muted">
                {e.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ObjetivesTable;

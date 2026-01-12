const ObjetivesTable = ({ objetives }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {objetives.map((e) => (
            <tr
              key={e.objetiveId}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                {e.objetiveId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{e.title}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
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

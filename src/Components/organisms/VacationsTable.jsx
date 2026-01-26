const VacationsTable = ({ vacationsList = [] }) => {
  if (!vacationsList.length) {
    return <p>No hay solicitudes de vacaciones registradas.</p>;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-CR");

  return (
    <table className="vacations-table">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>Fecha de inicio</th>
          <th>Fecha de finalización</th>
          <th>Días solicitados</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {vacationsList.map((vacation) => (
          <tr key={vacation.id}>
            <td>{vacation.employeeName}</td>
            <td>{formatDate(vacation.startDate)}</td>
            <td>{formatDate(vacation.endDate)}</td>
            <td>{vacation.requestedDays}</td>
            <td>
              <span className={`status ${vacation.status?.toLowerCase()}`}>
                {vacation.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VacationsTable;

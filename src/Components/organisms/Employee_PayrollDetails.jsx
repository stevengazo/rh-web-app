import { formatMoney } from "../../utils/formatMoney";

const Info = ({ label, value, tooltip }) => (
  <div
    className="flex justify-between items-center py-1 border-b last:border-b-0"
    title={tooltip}
  >
    <span className="text-sm text-slate-600">{label}</span>
    <span className="font-medium text-slate-800">
      {value !== null && value !== undefined ? value.toString() : '-'}
    </span>
  </div>
);

const Employee_PayrollDetails = ({ data }) => {
  if (!data) {
    return (
      <div className="p-4 text-sm text-red-600">
        ⚠ No hay información de planilla para este empleado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* SALARIOS BASE */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">
          Salarios base
        </h3>

        <Info
          label="Salario mensual"
          value={data.monthlySalary}
          tooltip="Salario mensual registrado en la planilla"
        />
        <Info
          label="Salario quincenal"
          value={data.biweeklySalary}
          tooltip="Salario quincenal registrado"
        />
        <Info
          label="Salario diario"
          value={data.dailySalary}
          tooltip="Salario diario registrado"
        />
        <Info
          label="Salario por hora"
          value={data.hourlySalary}
          tooltip="Salario por hora registrado"
        />
      </section>

      {/* HORAS Y DÍAS */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">
          Horas y días trabajados
        </h3>

        <Info
          label="Horas extra"
          value={data.overTimeHours}
          tooltip="Cantidad de horas extra registradas"
        />
        <Info
          label="Días feriados trabajados"
          value={data.holidayDaysWorked}
          tooltip="Cantidad de días feriados trabajados"
        />
        <Info
          label="Horas extra en feriado"
          value={data.holidayOvertimeHours}
          tooltip="Horas extra realizadas en días feriados"
        />
      </section>

      {/* INGRESOS ADICIONALES */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">
          Ingresos adicionales
        </h3>

        <Info
          label="Monto horas extra"
          value={data.overtimeAmount}
          tooltip="Monto total por horas extra"
        />
        <Info
          label="Monto feriados"
          value={data.holidayAmount}
          tooltip="Monto total por días feriados"
        />
        <Info
          label="Monto horas extra feriado"
          value={data.holidayOvertimeAmount}
          tooltip="Monto total por horas extra en feriado"
        />
        <Info
          label="Retroactivo"
          value={data.retroactivePay}
          tooltip="Monto retroactivo aplicado"
        />
        <Info
          label="Bonos"
          value={data.bonus}
          tooltip="Bonificaciones otorgadas"
        />
        <Info
          label="Comisiones"
          value={data.comissions}
          tooltip="Comisiones generadas"
        />
      </section>

      {/* DEDUCCIONES */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-2">
          Deducciones
        </h3>

        <Info
          label="Días incapacidad CCSS"
          value={data.ccssDays}
          tooltip="Días de incapacidad CCSS"
        />
        <Info
          label="Días incapacidad INS"
          value={data.insDays}
          tooltip="Días de incapacidad INS"
        />
        <Info
          label="Ausencias"
          value={data.absenseTime}
          tooltip="Días de ausencia registrados"
        />
      </section>

      {/* TOTALES */}
      <section className="pt-2 border-t">
        <Info
          label="Salario bruto"
          value={data.grossSalary}
          tooltip="Monto bruto registrado en la planilla"
        />
        <Info
          label="Total deducciones"
          value={data.totalDeductions}
          tooltip="Monto total de deducciones"
        />
        <Info
          label="Neto a pagar"
          value={data.netAmount}
          tooltip="Monto final a pagar al empleado"
        />
      </section>
    </div>
  );
};

export default Employee_PayrollDetails;

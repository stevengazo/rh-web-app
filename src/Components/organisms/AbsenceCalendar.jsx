import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AbsenceCalendar = ({ items = [], selectedItem }) => {

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  /* semana empezando lunes */
  let startWeekDay = firstDay.getDay();
  startWeekDay = startWeekDay === 0 ? 6 : startWeekDay - 1;

  const totalDays = lastDay.getDate();

  const days = [];

  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }

  const absencesByDay = useMemo(() => {
    const map = {};

    items.forEach((a) => {
      const date = new Date(a.startDate).toDateString();

      if (!map[date]) map[date] = [];

      map[date].push(a);
    });

    return map;

  }, [items]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="bg-white border border-gray-50  rounded-lg shadow-sm p-4">

      {/* header */}
      <div className="flex items-center justify-between mb-4">

        <button
          onClick={prevMonth}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        <h3 className="font-semibold text-slate-800 capitalize">
          {monthName} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* week days */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
        <div>Dom</div>
      </div>

      {/* calendar grid */}
      <div className="grid grid-cols-7 gap-2">

        {days.map((day, index) => {

          if (!day) {
            return <div key={index}></div>;
          }

          const key = day.toDateString();
          const dayAbsences = absencesByDay[key] || [];

          return (
            <div
              key={index}
              className="min-h-[90px] border  rounded-md p-2 text-xs bg-gray-50"
            >

              <div className="font-medium text-slate-700">
                {day.getDate()}
              </div>

              <div className="space-y-1 mt-1">

                {dayAbsences.slice(0, 2).map((a) => {

                  const isSelected = selectedItem?.id === a.id;

                  return (
                    <div
                      key={a.id}
                      className={`px-1 py-[2px] rounded text-[10px] truncate cursor-pointer
                        ${isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {a.user?.firstName} {a.user?.lastName}
                    </div>
                  );
                })}

                {dayAbsences.length > 2 && (
                  <div className="text-[10px] text-gray-500">
                    +{dayAbsences.length - 2} más
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default AbsenceCalendar;
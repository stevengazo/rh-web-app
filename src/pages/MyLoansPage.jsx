import { useAppContext } from '../context/AppContext';
import loansApi from '../api/loansApi';
import { useEffect, useState } from 'react';

const MyLoansPage = () => {
  const { user } = useAppContext();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLoansAsync = async () => {
    try {
      if (!user?.id) return;

      const resp = await loansApi.getLoansByUser(user.id);
      setLoans(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoansAsync();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Préstamos</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : loans.length === 0 ? (
        <p>No tienes préstamos registrados</p>
      ) : (
        <div className="space-y-6">
          {loans.map((loan) => {
            const totalPaid =
              loan.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;

            const pending = loan.amount - totalPaid;

            const monthlyFee =
              loan.paymentMonths > 0
                ? loan.amount / loan.paymentMonths
                : 0;

            return (
              <div
                key={loan.loanId}
                className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-md hover:shadow-lg hover:border-indigo-500 transition-all duration-300"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {loan.title}
                  </h2>
                  <span className="text-sm px-3 py-1 rounded-full bg-slate-100">
                    {loan.state}
                  </span>
                </div>

                {/* INFO PRINCIPAL */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Monto</p>
                    <p className="font-bold text-slate-800">
                      ₡{loan.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Pagado</p>
                    <p className="font-bold text-green-600">
                      ₡{totalPaid.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Pendiente</p>
                    <p className="font-bold text-red-500">
                      ₡{pending.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Cuota mensual</p>
                    <p className="font-bold text-indigo-600">
                      ₡{monthlyFee.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-4">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-indigo-500 h-3 rounded-full"
                      style={{
                        width: `${
                          loan.amount > 0
                            ? (totalPaid / loan.amount) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* FECHA */}
                <p className="text-xs text-slate-400 mt-3">
                  Solicitud:{' '}
                  {new Date(loan.requestAt).toLocaleDateString('es-CR')}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLoansPage;
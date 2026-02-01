import { motion } from 'framer-motion';

const CardAction = ({ action, status, OnHandleClick }) => {
  console.log(action);
  return (
    <>
      <motion.div
        layout
        onClick={()=> OnHandleClick()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
      >
        <div className="flex justify-between items-start">
          <div>
            
            <p className="font-semibold text-slate-800">
              {action.user?.firstName} {action.user?.lastName}
            </p>
            <p className="text-sm text-slate-500">{action.actionType?.name}</p>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium
            ${
              status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }
          `}
          >
            {status === 'pending' ? 'Pendiente' : 'Aprobada'}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600">{action.description}</p>

        <p className="mt-3 text-xs text-slate-400">
          {new Date(action.actionDate).toLocaleDateString()}
        </p>
      </motion.div>
    </>
  );
};

export default CardAction;

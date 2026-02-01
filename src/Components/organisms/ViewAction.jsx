import SectionTitle from '../SectionTitle';
import Divider from '../Divider';
import actionApi from '../../api/actionApi';
import actionTypeApi from '../../api/actionTypeApi';

const ViewAction = ({ action }) => {


    console.log(action)
  if (!action) return null;

  const isApproved = !!action.approvedBy;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <SectionTitle>
            {action.actionType?.name}
          </SectionTitle>
          <p className="text-sm text-slate-500">
            {action.user?.firstName} {action.user?.lastName}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              isApproved
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }
          `}
        >
          {isApproved ? 'Aprobada' : 'Pendiente'}
        </span>
      </div>

      <Divider />

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-400">Fecha</p>
          <p className="font-medium text-slate-700">
            {new Date(action.actionDate).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Creado por</p>
          <p className="font-medium text-slate-700">
            {action.createdBy}
          </p>
        </div>

        {isApproved && (
          <div>
            <p className="text-slate-400">Aprobado por</p>
            <p className="font-medium text-slate-700">
              {action.approvedBy}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <p className="text-slate-400 text-sm mb-1">Descripción</p>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {action.description || 'Sin descripción'}
        </div>
      </div>
    </div>
  );
};

export default ViewAction;

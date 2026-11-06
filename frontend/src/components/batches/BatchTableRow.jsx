import { formatDate, getDurationInWeeks, pluralize } from '../../utils/format.js';
import { Avatar } from '../common/Avatar.jsx';
import { EnrollmentBar } from './EnrollmentBar.jsx';
import { ModeBadge } from './ModeBadge.jsx';
import { StatusBadge } from './StatusBadge.jsx';

export function BatchTableRow({ batch }) {
  const { batchName, batchCode, instructor, mode, startDate, endDate, enrolled, capacity, status } = batch;
  const weeks = getDurationInWeeks(startDate, endDate);

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="py-4 pr-4 pl-4 sm:pl-6">
        <p className="max-w-56 truncate text-sm font-medium text-slate-900 sm:max-w-xs" title={batchName}>
          {batchName}
        </p>
        <p className="mt-1 font-mono text-xs text-slate-500">{batchCode}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={instructor} />
          <span className="text-sm whitespace-nowrap text-slate-700">{instructor}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <ModeBadge mode={mode} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <p className="text-sm text-slate-700">
          {formatDate(startDate)}
          <span className="mx-1.5 text-slate-300">→</span>
          {formatDate(endDate)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {weeks} {pluralize(weeks, 'week')}
        </p>
      </td>
      <td className="px-4 py-4">
        <EnrollmentBar enrolled={enrolled} capacity={capacity} />
      </td>
      <td className="py-4 pr-4 pl-4 sm:pr-6">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}

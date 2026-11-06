const Bar = ({ className }) => <div className={`rounded bg-slate-100 ${className}`} />;

function SkeletonRow() {
  return (
    <tr>
      <td className="py-4 pr-4 pl-4 sm:pl-6">
        <Bar className="h-4 w-60" />
        <Bar className="mt-2 h-3 w-24" />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-100" />
          <Bar className="h-4 w-28" />
        </div>
      </td>
      <td className="px-4 py-4">
        <Bar className="h-6 w-20 rounded-md" />
      </td>
      <td className="px-4 py-4">
        <Bar className="h-4 w-48" />
        <Bar className="mt-2 h-3 w-16" />
      </td>
      <td className="px-4 py-4">
        <Bar className="h-3 w-36" />
        <Bar className="mt-2 h-1.5 w-36 rounded-full" />
      </td>
      <td className="py-4 pr-4 pl-4 sm:pr-6">
        <Bar className="h-6 w-24 rounded-full" />
      </td>
    </tr>
  );
}

export function BatchTableSkeleton({ rows }) {
  return Array.from({ length: rows }, (_, index) => <SkeletonRow key={index} />);
}

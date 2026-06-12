export const TaskCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-5 w-12 rounded-full" />
    </div>
    <div className="skeleton h-3 w-full" />
    <div className="skeleton h-3 w-4/5" />
    <div className="flex items-center justify-between pt-2">
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-8 w-8 rounded-full" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <div className="flex items-center justify-between">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-9 w-9 rounded-xl" />
    </div>
    <div className="skeleton h-8 w-16" />
  </div>
);

export const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <TaskCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    <td className="px-4 py-3"><div className="skeleton h-4 w-40" /></td>
    <td className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
    <td className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
    <td className="px-4 py-3"><div className="skeleton h-4 w-24" /></td>
    <td className="px-4 py-3"><div className="skeleton h-4 w-16" /></td>
  </tr>
);

export default function PropertyCardSkeleton() {
  return (
    <div className="dh-card overflow-hidden dh-skeleton-pulse">
      <div className="h-56 skeleton" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between gap-3">
          <div className="h-5 skeleton rounded-lg flex-1" />
          <div className="h-5 skeleton rounded-lg w-24" />
        </div>
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-px skeleton mt-2" />
        <div className="flex gap-4 mt-1">
          <div className="h-4 skeleton rounded-lg w-16" />
          <div className="h-4 skeleton rounded-lg w-16" />
          <div className="h-4 skeleton rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 animate-pulse">
      <div className="h-14 w-14 rounded-2xl bg-white/10" />

      <div className="mt-5 h-5 w-3/4 rounded bg-white/10" />

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-5/6 rounded bg-white/10" />
      </div>
    </div>
  );
}
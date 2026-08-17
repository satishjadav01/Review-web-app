export default function CustomersLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading customers">
      <div className="h-12 w-56 rounded-xl bg-zinc-200" />
      <div className="h-14 max-w-xl rounded-2xl bg-zinc-100" />
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="h-20 bg-zinc-50" />
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-16 border-t border-zinc-100" />
        ))}
      </div>
    </div>
  );
}

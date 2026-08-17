export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading dashboard module">
      <div className="h-10 w-64 rounded-xl bg-zinc-200" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-36 rounded-3xl border border-zinc-200 bg-white" />
        ))}
      </div>
      <div className="h-80 rounded-3xl border border-zinc-200 bg-white" />
    </div>
  );
}

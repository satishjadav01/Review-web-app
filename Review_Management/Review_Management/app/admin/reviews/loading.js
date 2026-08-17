export default function ReviewsLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading reviews">
      <div className="h-12 w-72 rounded-xl bg-zinc-200" />
      <div className="h-14 rounded-2xl bg-zinc-100" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-72 rounded-[28px] border border-zinc-200 bg-zinc-50" />
        ))}
      </div>
    </div>
  );
}

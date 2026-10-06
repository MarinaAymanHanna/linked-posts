export default function LodingScreen({ count = 2 }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-slate-200 rounded-md w-32" />
              <div className="h-2.5 bg-slate-100 rounded-md w-20" />
            </div>
          </div>

          {/* Post Text */}
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-slate-200 rounded-md w-full" />
            <div className="h-3 bg-slate-200 rounded-md w-4/5" />
            <div className="h-3 bg-slate-100 rounded-md w-2/3" />
          </div>

          {/* Post Image Skeleton */}
          <div className="h-60 w-full rounded-xl bg-slate-200/80 mt-4" />

          {/* Reactions bar */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <div className="h-3 bg-slate-200 rounded-md w-16" />
            <div className="h-3 bg-slate-200 rounded-md w-24" />
          </div>

          {/* Actions bar */}
          <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100">
            <div className="h-8 bg-slate-100 rounded-xl" />
            <div className="h-8 bg-slate-100 rounded-xl" />
            <div className="h-8 bg-slate-100 rounded-xl" />
            <div className="h-8 bg-slate-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
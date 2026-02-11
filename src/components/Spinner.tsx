export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2" role="status" aria-live="polite" aria-label={label}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

import { Skeleton } from './skeleton';

// ── Primitive helpers ─────────────────────────────────────────────────────────

function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 md:px-6 py-4 border-b last:border-0">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${cols - 1}, 1fr)` }}>
        {Array.from({ length: cols - 1 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-3/4' : 'w-1/2'}`} />
        ))}
      </div>
      <Skeleton className="h-6 w-16 rounded-full shrink-0" />
    </div>
  );
}

// ── KPI card grid (dashboard / staff home) ────────────────────────────────────

export function SkeletonKPICards({ count = 6 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(count, 6)} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kpi-card">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// ── Table with rows ───────────────────────────────────────────────────────────

export function SkeletonTable({ rows = 8, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="audit-card">
      {/* Toolbar */}
      <div className="audit-card-header flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </div>
      {/* Pagination */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between border-t">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Simple list card (notifications, logs) ────────────────────────────────────

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 md:px-6 py-4 flex gap-4">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile / UserDetail header ───────────────────────────────────────────────

export function SkeletonProfile() {
  return (
    <div className="audit-card">
      <div className="audit-card-body">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Points / stats mini cards ─────────────────────────────────────────────────

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${count} gap-3 md:gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kpi-card">
          <Skeleton className="h-3 w-16 mb-3" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

// ── Settings / form page ──────────────────────────────────────────────────────

export function SkeletonForm({ fields = 5 }: { fields?: number }) {
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="audit-card-body space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-md mt-2" />
      </div>
    </div>
  );
}

// ── Staff home ────────────────────────────────────────────────────────────────

export function SkeletonStaffHome() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {/* Points ring card */}
      <div className="rounded-2xl bg-muted/30 p-6 flex items-center gap-6">
        <Skeleton className="h-28 w-28 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Referral code */}
      <div className="audit-card p-4">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      {/* Recent referrals */}
      <SkeletonList rows={3} />
    </div>
  );
}

// ── Full page skeleton (header + table) ───────────────────────────────────────

export function SkeletonPage({ rows = 8, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-16 border-b px-4 md:px-6 flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
      <div className="p-4 md:p-6 space-y-4">
        {/* Filter bar */}
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <SkeletonTable rows={rows} cols={cols} />
      </div>
    </div>
  );
}

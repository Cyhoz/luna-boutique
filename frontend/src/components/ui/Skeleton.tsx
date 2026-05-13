export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 ${className}`} />
  )
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full rounded-[2rem]" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-48" />
      </div>
    </div>
  )
}

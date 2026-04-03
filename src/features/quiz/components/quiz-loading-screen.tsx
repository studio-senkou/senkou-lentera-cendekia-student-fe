function QuizSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-28 rounded-full bg-neutral-lighter" />
      <div className="h-10 w-3/4 rounded-2xl bg-neutral-lighter" />
      <div className="space-y-3">
        <div className="h-20 rounded-2xl bg-neutral-lighter" />
        <div className="h-20 rounded-2xl bg-neutral-lighter" />
        <div className="h-20 rounded-2xl bg-neutral-lighter" />
      </div>
    </div>
  )
}

export function QuizLoadingScreen() {
  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <QuizSkeleton />
      </div>
    </div>
  )
}

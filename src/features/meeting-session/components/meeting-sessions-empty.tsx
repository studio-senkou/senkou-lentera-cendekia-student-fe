export const MeetingSessionsEmpty = () => {
  return (
    <div className="rounded-2xl border border-neutral-lighter bg-gradient-to-br from-bright-sun-lightest via-white to-downy-lightest p-5 shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-8">
        <p className="text-md text-neutral-darker">
          <i className="text-neutral-400">
            No meeting sessions available. Please check back later.
          </i>
        </p>
      </div>
    </div>
  )
}

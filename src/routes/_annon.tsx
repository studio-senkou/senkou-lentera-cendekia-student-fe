import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_annon')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

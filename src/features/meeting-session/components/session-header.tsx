import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

interface SessionHeaderProps {
  onBack?: () => void
}

export function SessionHeader({ onBack }: SessionHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  return (
    <header className="flex justify-between items-center p-4 py-8">
      <Button variant="ghost" onClick={handleBack}>
        <ChevronLeft />
      </Button>
    </header>
  )
}

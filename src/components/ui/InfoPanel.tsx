interface InfoPanelProps {
  children?: React.ReactNode
}

export function InfoPanel({ children }: InfoPanelProps) {
  return (
    <div className="my-4 rounded-lg border border-padel-500/40 bg-padel-500/10 p-4 sm:my-5 sm:p-5 md:my-6 md:p-6">
      {children}
    </div>
  )
}

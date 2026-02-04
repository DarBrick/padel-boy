interface InfoPanelProps {
  children: React.ReactNode;
}

export function InfoPanel({ children }: InfoPanelProps) {
  return (
    <div className="bg-[rgba(212,255,0,0.1)] border-l-[3px] border-[var(--color-padel-yellow)] p-4 my-4 rounded-lg">
      {children}
    </div>
  );
}

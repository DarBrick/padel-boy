interface TabSelectorProps {
  tabs: Array<{ id: string; label: string; disabled?: boolean }>
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              relative px-4 py-2.5 rounded-lg font-medium text-sm
              transition-all duration-200 whitespace-nowrap
              min-h-[44px] sm:min-h-[46px] md:min-h-[48px]
              ${
                tab.disabled
                  ? 'cursor-not-allowed border border-border/60 bg-surface/40 text-foreground-muted opacity-50'
                  : activeTab === tab.id
                  ? 'border border-padel-500 bg-surface-muted text-padel-500 shadow-[0_0_10px_rgba(212,255,0,0.3)]'
                  : 'border border-border/70 bg-surface/60 text-foreground-muted hover:border-foreground-muted hover:bg-surface-muted hover:text-foreground'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

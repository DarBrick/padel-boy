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
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              relative px-4 py-2.5 rounded-lg font-medium text-sm
              transition-all duration-200 whitespace-nowrap
              min-h-[44px] sm:min-h-[46px] md:min-h-[48px]
              ${
                tab.disabled
                  ? 'bg-slate-800/30 text-slate-600 border-2 border-slate-800 cursor-not-allowed opacity-50'
                  : activeTab === tab.id
                  ? 'bg-slate-800 text-[var(--color-padel-yellow)] border-2 border-[var(--color-padel-yellow)] shadow-[0_0_10px_rgba(212,255,0,0.3)]'
                  : 'bg-slate-800/50 text-slate-300 border-2 border-slate-700 hover:border-slate-600 hover:text-white'
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

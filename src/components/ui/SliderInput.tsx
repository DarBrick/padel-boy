interface SliderInputProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export function SliderInput({ min, max, value, onChange }: SliderInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value))
  }

  return (
    <div className="flex items-center gap-3 sm:gap-3.5 md:gap-4">
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={handleChange}
        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-center text-lg font-bold focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors"
      />
    </div>
  )
}

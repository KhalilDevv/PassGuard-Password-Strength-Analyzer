
const STRENGTH_CONFIG = {
  0: { label: 'Very Weak',  color: 'bg-red-500',    glow: 'shadow-red-500/30',    text: 'text-red-500',    segments: 1, pct: 5  },
  1: { label: 'Weak',       color: 'bg-orange-500', glow: 'shadow-orange-500/30', text: 'text-orange-500', segments: 1, pct: 25 },
  2: { label: 'Fair',       color: 'bg-amber-400',  glow: 'shadow-amber-400/30',  text: 'text-amber-400',  segments: 2, pct: 50 },
  3: { label: 'Strong',     color: 'bg-lime-500',   glow: 'shadow-lime-500/30',   text: 'text-lime-500',   segments: 3, pct: 75 },
  4: { label: 'Very Strong',color: 'bg-emerald-500',glow: 'shadow-emerald-500/30',text: 'text-emerald-500',segments: 4, pct: 100},
}


function SegmentBar({ score, hasPassword, config }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3].map(i => {
        const filled = hasPassword && i < config.segments
        return (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              filled ? `${config.color} shadow-md ${config.glow}` : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        )
      })}
    </div>
  )
}

export default function StrengthBar({ score, hasPassword, entropy, darkMode }) {
  const config = STRENGTH_CONFIG[score] ?? STRENGTH_CONFIG[0]
  const percentage = hasPassword ? config.pct : 0

  return (
    <div className="space-y-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-600 tracking-widest uppercase transition-colors duration-300 ${
            hasPassword ? config.text : (darkMode ? 'text-zinc-600' : 'text-zinc-400')
          }`}>
            {hasPassword ? config.label : 'No Password'}
          </span>
          {hasPassword && (
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.color} animate-pulse`} />
          )}
        </div>

        <div className="flex items-center gap-3">
        
          <span className={`text-xs font-mono transition-colors duration-300 ${
            darkMode ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            {percentage}%
          </span>
          <span className={`text-xs font-mono font-500 px-2 py-0.5 rounded-md ${
            darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
          }`}>
            {hasPassword ? score : '—'}/4
          </span>
        </div>
      </div>

      <SegmentBar score={score} hasPassword={hasPassword} config={config} />

      <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${config.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {hasPassword && entropy !== null && (
        <div className={`flex items-center justify-between text-xs font-mono ${
          darkMode ? 'text-zinc-500' : 'text-zinc-400'
        }`}>
          <span>Entropy estimate</span>
          <span className={`font-500 ${config.text}`}>{entropy.toFixed(1)} bits</span>
        </div>
      )}
    </div>
  )
}

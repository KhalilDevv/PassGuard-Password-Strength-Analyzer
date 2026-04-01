import { useState } from 'react'

/**
 * PasswordInput Component
 * Renders the password field with show/hide toggle and generate button
 */
export default function PasswordInput({ value, onChange, onGenerate, darkMode }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className={`block text-xs font-mono font-500 tracking-widest uppercase ${
        darkMode ? 'text-zinc-400' : 'text-zinc-500'
      }`}>
        Enter Password
      </label>

      {/* Input wrapper */}
      <div className={`relative flex items-center rounded-xl border-2 transition-all duration-300 ${
        darkMode
          ? 'bg-zinc-900 border-zinc-700 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]'
          : 'bg-white border-zinc-200 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]'
      }`}>
        {/* Lock icon */}
        <span className="pl-4 text-zinc-400 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </span>

        {/* Input field */}
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Type your password…"
          autoComplete="new-password"
          spellCheck={false}
          className={`flex-1 px-3 py-4 bg-transparent font-mono text-sm outline-none placeholder:font-sans placeholder:text-zinc-400 ${
            darkMode ? 'text-zinc-100' : 'text-zinc-800'
          }`}
        />

        {/* Toggle visibility */}
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          title={visible ? 'Hide password' : 'Show password'}
          className={`px-3 flex-shrink-0 transition-colors duration-200 ${
            darkMode ? 'text-zinc-500 hover:text-emerald-400' : 'text-zinc-400 hover:text-emerald-600'
          }`}
        >
          {visible ? (
            // Eye-off icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            // Eye icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>

      {/* Generate strong password button */}
      <button
        type="button"
        onClick={onGenerate}
        className={`w-full py-2.5 rounded-xl text-xs font-mono font-500 tracking-wider uppercase border transition-all duration-200 flex items-center justify-center gap-2 group ${
          darkMode
            ? 'border-zinc-700 text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30'
            : 'border-zinc-200 text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform duration-200">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Generate Strong Password
      </button>
    </div>
  )
}

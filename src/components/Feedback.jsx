import { useState } from 'react'


const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 flex-shrink-0">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)


const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)


const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 flex-shrink-0">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)


const CopyIcon = ({ checked }) => checked ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)


const RULES = [
  { label: 'At least 12 characters', test: p => p.length >= 12 },
  { label: 'Uppercase letter (A–Z)',  test: p => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a–z)',  test: p => /[a-z]/.test(p) },
  { label: 'Number (0–9)',             test: p => /[0-9]/.test(p) },
  { label: 'Special character (!@#…)',test: p => /[^A-Za-z0-9]/.test(p) },
]


const COMMON_PASSWORDS = new Set([
  'password','123456','123456789','12345678','12345','1234567','password1',
  'admin','qwerty','abc123','letmein','monkey','1234','dragon','master',
  'sunshine','princess','welcome','shadow','superman','iloveyou','trustno1',
  'password123','admin123','root','toor','pass','test','guest','login',
])

export default function Feedback({ result, password, darkMode }) {
  const [copied, setCopied] = useState(false)

  if (!result || !password) return null

  const crackTime = result.crack_times_display?.offline_slow_hashing_1e4_per_second ?? 'unknown'
  const suggestions = result.feedback?.suggestions ?? []
  const warning = result.feedback?.warning ?? ''
  const isCommon = COMMON_PASSWORDS.has(password.toLowerCase())


  const tipsText = [
    isCommon ? '⚠ This is a commonly used, unsafe password!' : null,
    warning ? `⚠ Warning: ${warning}` : null,
    `Estimated crack time: ${crackTime}`,
    suggestions.length ? `Suggestions:\n${suggestions.map(s => `• ${s}`).join('\n')}` : null,
    `\nPassword rules:\n${RULES.map(r => `${r.test(password) ? '✔' : '✘'} ${r.label}`).join('\n')}`,
  ].filter(Boolean).join('\n\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(tipsText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-4 animate-fade-up">

  
      {isCommon && (
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${
          darkMode
            ? 'bg-red-950/30 border-red-900/50 text-red-400'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <span className="mt-0.5"><WarnIcon /></span>
          <span className="text-xs font-sans leading-relaxed">
            This password is <strong>commonly used</strong> and extremely unsafe. Attackers will try it first.
          </span>
        </div>
      )}

      
      {warning && !isCommon && (
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${
          darkMode
            ? 'bg-amber-950/30 border-amber-900/50 text-amber-400'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <span className="mt-0.5"><WarnIcon /></span>
          <span className="text-xs font-sans leading-relaxed">{warning}</span>
        </div>
      )}

     
      <div className={`flex items-center justify-between p-3.5 rounded-xl ${
        darkMode ? 'bg-zinc-800/60' : 'bg-zinc-50'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className={darkMode ? 'text-zinc-400' : 'text-zinc-500'}>
            <ClockIcon />
          </span>
          <span className={`text-xs font-mono tracking-wide uppercase ${
            darkMode ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            Estimated crack time
          </span>
        </div>
        <span className={`text-xs font-mono font-600 ${
          darkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          {crackTime}
        </span>
      </div>

      
      <div className={`p-4 rounded-xl border space-y-2.5 ${
        darkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50/80'
      }`}>
        <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${
          darkMode ? 'text-zinc-500' : 'text-zinc-400'
        }`}>
          Requirements
        </p>
        {RULES.map(rule => {
          const passes = rule.test(password)
          return (
            <div key={rule.label} className="flex items-center gap-2.5">
              {passes ? <CheckIcon /> : <XIcon />}
              <span className={`text-xs font-sans transition-colors duration-200 ${
                passes
                  ? (darkMode ? 'text-zinc-300' : 'text-zinc-600')
                  : (darkMode ? 'text-zinc-600 line-through' : 'text-zinc-400 line-through')
              }`}>
                {rule.label}
              </span>
            </div>
          )
        })}
      </div>

     
      {suggestions.length > 0 && (
        <div className={`p-4 rounded-xl border space-y-2 ${
          darkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50/80'
        }`}>
          <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${
            darkMode ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            Suggestions
          </p>
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5 animate-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="mt-0.5 text-emerald-500 flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
              <span className={`text-xs font-sans leading-relaxed ${
                darkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      )}

      
      <button
        onClick={handleCopy}
        className={`w-full py-3 rounded-xl text-xs font-mono font-500 tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 ${
          copied
            ? (darkMode ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800' : 'bg-emerald-50 text-emerald-600 border border-emerald-200')
            : (darkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 border border-zinc-200')
        }`}
      >
        <CopyIcon checked={copied} />
        {copied ? 'Copied to Clipboard!' : 'Copy Security Tips'}
      </button>
    </div>
  )
}
